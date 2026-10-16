# Northstar School Operations — Authentication Edition

The existing HTML/CSS/JavaScript dashboard is retained, with a Node.js authentication server added. Passwords are hashed with bcrypt, sign-in uses server-side sessions, login attempts are rate-limited, and role access is checked by the server for protected API routes.

## Run on your laptop

1. Install Node.js 18 or newer.
2. Extract this ZIP and open the `northstar-auth` folder in VS Code.
3. Open a terminal in that folder.
4. Run `npm install`.
5. Run `npm start`.
6. Open **http://localhost:3000** in Chrome. Do not open `index.html` directly or use Live Server; the login needs the Node server.

## First-run demo accounts

On the first run only, the server creates a local `data/users.json` file with hashed passwords:

| Role | Username | Demo password |
|---|---|---|
| Accountant | `accountant` | `Accountant@2026` |
| HOD | `hod` | `HOD@2026` |
| GM | `gm` | `GM@2026` |

These are demonstration credentials. Change them before real use. The user file is intentionally ignored by Git. To recreate the initial users after testing, stop the server and delete `data/users.json`, then start it again. Do not do this if you need to preserve your accounts.

## Configure credentials

For a fresh setup, copy `.env.example` to `.env`, replace all passwords and the session secret, and load the values into your environment before starting Node. The server loads `.env` automatically through `dotenv`. Set `NODE_ENV=production` and use HTTPS when deploying so session cookies are secure.

## Important deployment note

This is a local starter implementation, not a finished production school MIS. The dashboard still contains fictional sample records in browser-side JavaScript, and many dashboard actions are prototype interactions. Authentication protects sign-in and the included server API routes, but it does not turn those sample records into a secure live database. Before storing real student, fee, payroll, or financial data, move all records and every sensitive operation to a database-backed API, enforce permissions on each API endpoint, add account management/password reset/audit logging, use HTTPS, and configure a persistent session store. Do not deploy the frontend-only version to GitHub Pages expecting authentication to work; GitHub Pages cannot run this Node.js server.
