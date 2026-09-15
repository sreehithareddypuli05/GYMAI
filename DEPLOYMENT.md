# GymAI Deployment Checklist

## Backend
Set these environment variables in your hosting provider:

- `DATABASE_URL` — PostgreSQL URL for production.
- `SECRET_KEY` — long random secret.
- `CORS_ORIGINS` — deployed frontend URL.
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USER` — Gmail address used to send reset emails.
- `SMTP_PASSWORD` — Google 16-character App Password.
- `SMTP_FROM` — optional sender display, e.g. `GymAI <you@gmail.com>`.
- `SMTP_USE_TLS=true`
- `PASSWORD_RESET_EXPIRE_MINUTES=10`
- `PASSWORD_RESET_RESEND_SECONDS=60`

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Set the backend root to `backend`.

## Frontend
Set:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

Build:

```bash
npm install
npm run build
```

Deploy the generated `dist` directory using your frontend host.

## Gmail SMTP
Turn on 2-Step Verification for the sending Google account, then create a Google App Password. Put that App Password in `SMTP_PASSWORD`. Never commit it to GitHub.

## Important
The delivered project intentionally does not contain `.env`, `node_modules`, `.venv`, or the local SQLite database. Those are environment-specific and/or may contain secrets or user data.
