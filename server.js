'use strict';
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const production = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(48).toString('hex');

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(session({
  name: 'northstar.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 1000 * 60 * 60 * 4 }
}));

const rolePermissions = {
  accountant: ['overview','students','fees','inventory','vendors','expenses','approvals','reports'],
  hod: ['overview','students','fees','expenses','approvals','reports'],
  gm: ['overview','students','fees','inventory','vendors','expenses','approvals','reports','settings']
};
const displayNames = { accountant: 'Accountant', hod: 'HOD', gm: 'General Manager' };

function safeUser(user) {
  return { id: user.id, username: user.username, role: user.role, displayName: user.displayName };
}
function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
  catch { return []; }
}
function writeUsers(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), { mode: 0o600 });
}
async function seedUsers() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(USERS_FILE)) return;
  const accounts = [
    { id: 'usr-accountant', username: process.env.NORTHSTAR_ACCOUNTANT_USERNAME || 'accountant', role: 'accountant', displayName: 'Accountant', password: process.env.NORTHSTAR_ACCOUNTANT_PASSWORD || 'Accountant@2026' },
    { id: 'usr-hod', username: process.env.NORTHSTAR_HOD_USERNAME || 'hod', role: 'hod', displayName: 'HOD', password: process.env.NORTHSTAR_HOD_PASSWORD || 'HOD@2026' },
    { id: 'usr-gm', username: process.env.NORTHSTAR_GM_USERNAME || 'gm', role: 'gm', displayName: 'General Manager', password: process.env.NORTHSTAR_GM_PASSWORD || 'GM@2026' }
  ];
  const users = [];
  for (const account of accounts) {
    const passwordHash = await bcrypt.hash(account.password, 12);
    users.push({ id: account.id, username: account.username, role: account.role, displayName: account.displayName, passwordHash });
  }
  writeUsers(users);
}
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: 'Please sign in to continue.' });
  next();
}
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ message: 'Please sign in to continue.' });
    if (!roles.includes(req.session.user.role)) return res.status(403).json({ message: 'Your account is not allowed to perform this action.' });
    next();
  };
}
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' } });

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/session', (req, res) => {
  if (!req.session.user) return res.json({ authenticated: false });
  res.json({ authenticated: true, user: safeUser(req.session.user) });
});
app.post('/api/login', loginLimiter, async (req, res, next) => {
  try {
    const role = String(req.body?.role || '').toLowerCase();
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!rolePermissions[role] || !username || !password || password.length > 200) {
      return res.status(400).json({ message: 'Choose a role and enter your username and password.' });
    }
    const user = readUsers().find(u => u.username.toLowerCase() === username && u.role === role);
    // Perform a hash comparison even for unknown usernames to reduce timing differences.
    const hashToCheck = user?.passwordHash || '$2b$12$C6UzMDM.H6dfI/f/IKcEe.6hV9tF7x7u7h2sM6XG8pH8Yq9v4f6sK';
    const valid = await bcrypt.compare(password, hashToCheck);
    if (!user || !valid) return res.status(401).json({ message: 'The username, password, or selected role is incorrect.' });
    req.session.regenerate(err => {
      if (err) return next(err);
      req.session.user = { id: user.id, username: user.username, role: user.role, displayName: user.displayName };
      req.session.save(saveErr => {
        if (saveErr) return next(saveErr);
        res.json({ user: safeUser(user) });
      });
    });
  } catch (err) { next(err); }
});
app.post('/api/logout', (req, res, next) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(err => {
    if (err) return next(err);
    res.clearCookie('northstar.sid', { httpOnly: true, sameSite: 'lax', secure: production });
    res.json({ ok: true });
  });
});
app.get('/api/access/:page', requireAuth, (req, res) => {
  const page = String(req.params.page || '');
  const allowed = rolePermissions[req.session.user.role] || [];
  if (!allowed.includes(page)) return res.status(403).json({ allowed: false, message: 'This workspace does not have permission to open that section.' });
  res.json({ allowed: true, role: req.session.user.role, page });
});
// Example protected endpoint: only the General Manager may manage account access.
app.get('/api/admin/users', requireRole('gm'), (_req, res) => {
  res.json(readUsers().map(u => ({ id: u.id, username: u.username, role: u.role, displayName: u.displayName })));
});
app.use(express.static(__dirname, { index: false, dotfiles: 'deny', setHeaders(res, filePath) {
  if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-store');
} }));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'A server error occurred. Please try again.' });
});

seedUsers().then(() => {
  app.listen(PORT, () => {
    console.log(`Northstar is running at http://localhost:${PORT}`);
    if (!process.env.SESSION_SECRET) console.warn('For deployment, set SESSION_SECRET to a long random secret.');
    if (!production) console.log('First-run demo accounts: accountant / Accountant@2026, hod / HOD@2026, gm / GM@2026');
  });
}).catch(err => { console.error('Could not initialize user store:', err); process.exit(1); });
