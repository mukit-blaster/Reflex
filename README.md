# Reflex — Your Mental Wellness Companion

Reflex is a full-stack mental wellness platform: a public-facing site for booking
appointments with psychiatrists plus an admin dashboard for managing users and
appointments.

## Stack

- **Frontend:** static HTML / CSS / vanilla JS (in `public/`)
- **Backend:** Node + Express (`lib/app.js`)
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (with a built-in admin login from env vars)
- **Hosting:** Vercel — `api/index.js` is the serverless entrypoint

## Services offered

- Yoga therapy
- Laughing therapy
- Talking therapy
- Reading therapy
- Audio therapy
- Psychiatrist consultations

## Project layout

```
.
├── api/index.js          # Vercel serverless entrypoint (re-exports lib/app.js)
├── lib/
│   ├── app.js            # Express app, all /api/* routes
│   └── mongo.js          # Cached Mongoose connection
├── models/
│   ├── Appointment.js
│   └── User.js
├── public/               # Static frontend (index.html, booking.html, dashboard.html, ...)
├── server.js             # Local dev launcher (not used by Vercel)
├── vercel.json
├── .env.example
└── package.json
```

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. Open <http://localhost:8080>.

The admin dashboard is at <http://localhost:8080/dashboard.html>. Log in via
`/login.html` with the `ADMIN_USER` / `ADMIN_PASS` you set in `.env` (defaults
are `admin` / `admin` for local dev only).

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project** and import the repo. No build command
   or output directory is needed — Vercel detects `api/index.js` as a
   serverless function and serves `public/` as static assets.
3. Under **Settings → Environment Variables**, add:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a long random string (e.g. `openssl rand -hex 32`)
   - `ADMIN_USER` — the admin username
   - `ADMIN_PASS` — the admin password
4. Click **Deploy**. Subsequent pushes auto-deploy.

You can also deploy from the CLI:
```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

## API surface

All routes are under `/api`.

| Method | Path                              | Auth        | Purpose                       |
| ------ | --------------------------------- | ----------- | ----------------------------- |
| POST   | `/api/signup`                     | public      | Register a new user           |
| POST   | `/api/login`                      | public      | Log in (returns JWT)          |
| GET    | `/api/me`                         | bearer      | Current token info            |
| POST   | `/api/appointment`                | public      | Submit a booking              |
| GET    | `/api/appointments?q=&status=`    | admin       | List / search appointments    |
| PUT    | `/api/appointments/:id`           | admin       | Edit an appointment           |
| PUT    | `/api/appointments/:id/status`    | admin       | Approve / reject              |
| DELETE | `/api/appointments/:id`           | admin       | Remove an appointment         |
| GET    | `/api/users`                      | admin       | List registered users         |
| DELETE | `/api/users/:id`                  | admin       | Remove a user                 |
| GET    | `/api/dashboard-stats`            | admin       | Counts for the home cards     |
| GET    | `/api/health`                     | public      | Liveness check                |

Admin endpoints expect `Authorization: Bearer <token>`. The token is issued by
`/api/login` when the credentials match `ADMIN_USER` / `ADMIN_PASS`, or when a
DB user has `role: "admin"`.

## Promoting a database user to admin

The built-in admin (`ADMIN_USER`/`ADMIN_PASS`) is the simplest path. To grant
admin to an existing DB user, update their document directly in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
