# Reflex — Mental Wellness Companion

Reflex is a full-stack mental wellness platform that connects users with psychiatric and therapeutic services. It provides a public-facing site for browsing services and booking appointments, alongside a secure admin dashboard for managing users and appointments.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Static HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express 5 |
| Database | MongoDB via Mongoose |
| Auth | JSON Web Tokens (JWT) |

## Features

- User registration and authentication
- Appointment booking for multiple therapy types
- Admin dashboard with user and appointment management
- Appointment status workflow (pending → approved / rejected)
- Role-based access control (public, user, admin)

## Services

- Yoga Therapy
- Laughing Therapy
- Talking Therapy
- Reading Therapy
- Audio Therapy
- Psychiatrist Consultations

## Project Structure

```
.
├── api/
│   └── index.js          # Serverless entrypoint (re-exports lib/app.js)
├── lib/
│   ├── app.js            # Express app and all /api/* routes
│   └── mongo.js          # Cached Mongoose connection helper
├── models/
│   ├── Appointment.js
│   └── User.js
├── public/               # Static frontend
│   ├── index.html
│   ├── booking.html
│   ├── dashboard.html
│   ├── login.html
│   ├── signup.html
│   ├── yoga.html
│   └── reading.html
├── server.js             # Local development server launcher
├── vercel.json
├── .env.example
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- A running MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mukit-blaster/Reflex.git
   cd Reflex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and fill in the required values (see [Environment Variables](#environment-variables)).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

The admin dashboard is available at [http://localhost:8080/dashboard.html](http://localhost:8080/dashboard.html). Log in at `/login.html` using the `ADMIN_USER` and `ADMIN_PASS` values you configured in `.env`.

## Environment Variables

| Variable | Description | Default (dev only) |
|----------|-------------|-------------------|
| `MONGODB_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for signing JWTs (use a long random string) | — |
| `ADMIN_USER` | Admin account username | `admin` |
| `ADMIN_PASS` | Admin account password | `admin` |
| `PORT` | Port the server listens on | `8080` |

> **Warning:** The default `admin`/`admin` credentials are for local development only. Always set strong values in any non-local environment.

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/signup` | Public | Register a new user |
| `POST` | `/api/login` | Public | Authenticate and receive a JWT |
| `GET` | `/api/me` | Bearer token | Retrieve current token info |
| `POST` | `/api/appointment` | Public | Submit a booking request |
| `GET` | `/api/appointments?q=&status=` | Admin | List and search appointments |
| `PUT` | `/api/appointments/:id` | Admin | Update appointment details |
| `PUT` | `/api/appointments/:id/status` | Admin | Approve or reject an appointment |
| `DELETE` | `/api/appointments/:id` | Admin | Delete an appointment |
| `GET` | `/api/users` | Admin | List all registered users |
| `DELETE` | `/api/users/:id` | Admin | Delete a user |
| `GET` | `/api/dashboard-stats` | Admin | Retrieve dashboard summary counts |
| `GET` | `/api/health` | Public | Server liveness check |

Admin endpoints require an `Authorization: Bearer <token>` header. A token with admin privileges is issued by `/api/login` when credentials match `ADMIN_USER`/`ADMIN_PASS`, or when the authenticated DB user has `role: "admin"`.

## Granting Admin Access to a Database User

To elevate an existing database user to admin, run the following directly in MongoDB:

```js
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.
