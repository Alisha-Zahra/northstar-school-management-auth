# Northstar School Management — Authentication Demo

A Node.js/Express demo with role-based sign-in for Accountant, HOD, and General Manager. The app has a **Switch role** control: it ends the current server session and returns to the role picker, where the next role must sign in with its own credentials.

## Run locally

1. Install Node.js 18 or newer.
2. Open this folder in VS Code.
3. In the terminal, run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000` in your browser. Do not open `index.html` directly or use VS Code Live Server.

## Demo accounts

| Role | Username | Password |
|---|---|---|
| Accountant | `accountant` | `Accountant@2026` |
| HOD | `hod` | `HOD@2026` |
| General Manager (GM) | `gm` | `GM@2026` |

These are public demo credentials and must only be used with fictional/sample data. The app does not support unrestricted login with any password; each role must authenticate. Use **Switch role** or **Log out** to return to the role picker.

## Deploy from GitHub with Render

GitHub Pages only hosts static files and cannot run this Express backend. Use Render for a public demo URL.

1. Push this project folder's files to the GitHub repository (including `render.yaml`).
2. Sign in to Render and choose **New + → Blueprint**.
3. Connect the GitHub repository containing this project and select the `main` branch.
4. Render reads `render.yaml`; review the service and create/deploy it.
5. Wait until the service is **Live**, then open the Render URL ending in `.onrender.com`.
6. Test all three demo accounts and the **Switch role** button.

The Blueprint sets `NODE_ENV=production` and generates a `SESSION_SECRET`. If you create the service manually instead, use:
- Build command: `npm install`
- Start command: `npm start`
- Environment variable `NODE_ENV`: `production`
- Environment variable `SESSION_SECRET`: a long, random secret

## Important limitations

This is still a **demo/prototype**, not a production school information system. Dashboard records and many actions are sample data held in browser JavaScript, and sessions use Express's default in-memory store. The app does not currently save school records in a database or provide complete server-side authorization for every dashboard action. Do not enter real student details, fee records, staff information, or financial data. A real deployment needs a database, a persistent session store, server-enforced permissions on every operation, account administration, password reset, audit logs, backups, and security review.
