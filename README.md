# GymAI — Training Intelligence

GymAI is a training operating system: readiness, load, and personalized programming
in one place. This is the first 50% production-quality build — a complete, polished
frontend plus a real authentication backend. AI features (workout generation, an AI
coach, adaptive programming) are intentionally deferred to the next phase; the
service layer is already shaped so they can be swapped in without a rewrite.

## Stack

**Frontend** — React + Vite + TypeScript, Tailwind CSS, React Router, Framer Motion,
Axios, Lucide React, and a small set of custom React-Bits-style motion primitives
(spotlight cards, magnetic buttons, animated headings, scroll reveals) re-themed to
GymAI's Charcoal + Emerald system.

**Backend** — FastAPI, SQLAlchemy, JWT auth, Pydantic, Uvicorn. SQLite by default for
local development; the SQLAlchemy URL is Postgres-ready — swap `DATABASE_URL` and
nothing else changes.

## Brand

Charcoal (`#0B0F0D`) + Emerald (`#10B981` / `#059669` / `#34D399`), Space Grotesk for
display type, Inter for body text, JetBrains Mono for data figures.

## Signature interaction

The **Evasive Login Button**: while the login/register form is incomplete, the
button gently slides away from an approaching cursor and settles back to a normal,
stable button the moment both fields are valid. It's disabled for keyboard focus,
touch devices, and `prefers-reduced-motion`, so it never blocks anyone from
submitting the form.

## Project structure

```
GymAI/
├── frontend/          React + Vite + TS app
│   └── src/
│       ├── components/
│       │   ├── ui/        Button, Input, PasswordInput, Badge, Modal, Tooltip,
│       │   │               Avatar, Progress, Skeleton, Spinner
│       │   ├── layout/     Navbar, Sidebar, MobileNav, PageHeader, Footer, UserMenu, AppShell
│       │   ├── gymai/      WorkoutCard, ExerciseCard, ExerciseModal, StatCard,
│       │   │               ReadinessCard, TrainingLoadCard, AIInsightCard, ProgressCard,
│       │   │               HistoryCard, WorkoutTimer, WorkoutProgress, TrainingStatus
│       │   ├── landing/    Hero, sections, and the motion primitives (effects.tsx)
│       │   └── auth/       AuthLayout, EvasiveButton
│       ├── pages/          Landing, Login, Register, Dashboard, Workout, Exercises,
│       │                   Progress, History, Profile, Settings, NotFound
│       ├── data/           Centralized mock data (workouts, exercises, progress, history, insights)
│       ├── services/       authService (real API) + mock-backed services ready to swap for real APIs
│       ├── context/        AuthContext, ToastContext
│       └── routes/         ProtectedRoute
└── backend/            FastAPI auth service
    └── app/
        ├── main.py         App entry, CORS, router mounting
        ├── config.py       Settings from environment (.env)
        ├── database.py     SQLAlchemy engine/session (SQLite dev, Postgres-ready)
        ├── models.py       User model
        ├── schemas.py      Pydantic request/response models
        ├── security.py     Password hashing, JWT creation/verification
        ├── deps.py         get_current_user dependency
        └── routers/auth.py POST /register, /login, GET /me, POST /logout
```

## Running it locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # defaults already work for local dev
uvicorn app.main:app --reload --port 8000
```

The API is now at `http://localhost:8000` (docs at `/docs`).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env            # points VITE_API_URL at the backend above
npm run dev
```

The app is now at `http://localhost:5173`. Register a new account — it's a real
account created in the backend's SQLite database (`backend/gymai.db`).

## What's real vs. mock

- **Authentication is real** — register, login, `/me`, and logout all hit the
  FastAPI backend, with hashed passwords and JWTs.
- **Everything inside the dashboard (workouts, exercises, progress, history, AI
  insights) is mock data**, served through a service-layer abstraction in
  `frontend/src/services/`. Each function is `async` and already shaped like a real
  API call, so replacing the mock implementation with a live endpoint later doesn't
  touch any component.

## Verified in this build

- `npm run build` (tsc + vite build) completes with no errors.
- Backend endpoints tested end-to-end: register, duplicate-email rejection, login,
  wrong-password rejection, `/me` with and without a token, and logout.
- CORS confirmed working between `localhost:5173` and `localhost:8000`.
