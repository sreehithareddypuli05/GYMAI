# GymAI — Training Intelligence

> **A training operating system for readiness, training load, and personalized programming.**

GymAI brings your fitness workflow into one place — helping users understand their readiness, monitor training load, track progress, and manage workouts through a polished, modern interface.

This is the **first production-quality phase** of GymAI. The frontend experience and authentication system are fully implemented, while AI-powered features such as workout generation, AI coaching, and adaptive programming are intentionally planned for the next phase.

---

## Features

### Authentication

GymAI includes a real authentication backend powered by FastAPI.

* User registration
* User login
* JWT-based authentication
* Password hashing
* Protected routes
* Get current authenticated user
* Logout endpoint
* Duplicate email validation
* Invalid credential handling
* CORS support between frontend and backend

### Training Dashboard

The current frontend includes a complete fitness dashboard experience with:

* Training readiness overview
* Training load monitoring
* Workout recommendations
* Exercise browsing
* Workout history
* Progress tracking
* Training status
* Personalized insights
* Profile management
* Application settings

> Currently, training, workout, exercise, progress, history, and AI insight data are powered by centralized mock services. The service layer is designed so these can later be replaced with real backend APIs without rewriting the UI components.

---

## Signature Interaction

### Evasive Login Button

GymAI includes a custom authentication interaction called the **Evasive Login Button**.

When the login or registration form is incomplete, the submit button gently moves away as the cursor approaches it.

Once all required fields are valid:

* The button immediately returns to its normal position.
* The button becomes stable and clickable.
* Keyboard users are never blocked.
* Touch devices are unaffected.
* The interaction respects `prefers-reduced-motion`.

The goal is to create a playful interaction without compromising accessibility.

---

## Tech Stack

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Framer Motion
* Axios
* Lucide React

The UI also includes custom motion primitives inspired by modern interactive component systems:

* Spotlight cards
* Magnetic buttons
* Animated headings
* Scroll reveal animations

These interactions are customized specifically for the GymAI visual system.

### Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* Pydantic
* Uvicorn
* SQLite

The database configuration is also ready for PostgreSQL.

Switching databases only requires updating:

```env
DATABASE_URL=your_postgresql_database_url
```

No application-level database rewrite is required.

---

## Design System

GymAI uses a focused visual identity designed around performance and clarity.

### Colors

| Color         | Value     |
| ------------- | --------- |
| Charcoal      | `#0B0F0D` |
| Emerald       | `#10B981` |
| Deep Emerald  | `#059669` |
| Light Emerald | `#34D399` |

### Typography

* **Space Grotesk** — Display headings
* **Inter** — Body content
* **JetBrains Mono** — Metrics, statistics, and training data

The design emphasizes:

* Professional fitness aesthetics
* High information density
* Responsive layouts
* Minimal glassmorphism
* Clear visual hierarchy
* Motion with purpose
* Accessible interactions

---

## Project Structure

```text
GymAI/
│
├── frontend/
│   └── src/
│       │
│       ├── components/
│       │   ├── ui/
│       │   │   ├── Button
│       │   │   ├── Input
│       │   │   ├── PasswordInput
│       │   │   ├── Badge
│       │   │   ├── Modal
│       │   │   ├── Tooltip
│       │   │   ├── Avatar
│       │   │   ├── Progress
│       │   │   ├── Skeleton
│       │   │   └── Spinner
│       │   │
│       │   ├── layout/
│       │   │   ├── Navbar
│       │   │   ├── Sidebar
│       │   │   ├── MobileNav
│       │   │   ├── PageHeader
│       │   │   ├── Footer
│       │   │   ├── UserMenu
│       │   │   └── AppShell
│       │   │
│       │   ├── gymai/
│       │   │   ├── WorkoutCard
│       │   │   ├── ExerciseCard
│       │   │   ├── ExerciseModal
│       │   │   ├── StatCard
│       │   │   ├── ReadinessCard
│       │   │   ├── TrainingLoadCard
│       │   │   ├── AIInsightCard
│       │   │   ├── ProgressCard
│       │   │   ├── HistoryCard
│       │   │   ├── WorkoutTimer
│       │   │   ├── WorkoutProgress
│       │   │   └── TrainingStatus
│       │   │
│       │   ├── landing/
│       │   │   ├── Hero
│       │   │   ├── Landing Sections
│       │   │   └── effects.tsx
│       │   │
│       │   └── auth/
│       │       ├── AuthLayout
│       │       └── EvasiveButton
│       │
│       ├── pages/
│       │   ├── Landing
│       │   ├── Login
│       │   ├── Register
│       │   ├── Dashboard
│       │   ├── Workout
│       │   ├── Exercises
│       │   ├── Progress
│       │   ├── History
│       │   ├── Profile
│       │   ├── Settings
│       │   └── NotFound
│       │
│       ├── data/
│       │   └── Centralized mock data
│       │
│       ├── services/
│       │   ├── authService
│       │   └── Mock-backed service layer
│       │
│       ├── context/
│       │   ├── AuthContext
│       │   └── ToastContext
│       │
│       └── routes/
│           └── ProtectedRoute
│
└── backend/
    └── app/
        ├── main.py
        ├── config.py
        ├── database.py
        ├── models.py
        ├── schemas.py
        ├── security.py
        ├── deps.py
        │
        └── routers/
            └── auth.py
```

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

* Python 3.10+
* Node.js 18+
* npm

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it.

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```bash
cp .env.example .env
```

The default configuration works for local development.

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend will be available at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

The frontend environment should point to the backend:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

Example:

```env
DATABASE_URL=sqlite:///./gymai.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

For PostgreSQL, simply replace the database URL:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/gymai
```

---

## Frontend

```env
VITE_API_URL=http://localhost:8000
```

---

# Authentication API

## Register

```http
POST /register
```

Creates a new user account.

---

## Login

```http
POST /login
```

Authenticates a user and returns a JWT access token.

---

## Get Current User

```http
GET /me
```

Requires a valid JWT token.

---

## Logout

```http
POST /logout
```

Handles user logout.

---

# Real vs Mock Data

GymAI currently follows a hybrid architecture.

### Real

Authentication is fully functional:

* Register
* Login
* JWT authentication
* Password hashing
* Current user retrieval
* Logout
* Protected frontend routes

User accounts are stored in:

```text
backend/gymai.db
```

during local SQLite development.

### Mock

The following areas currently use mock data:

* Workouts
* Exercises
* Training readiness
* Training load
* Progress
* Workout history
* AI insights
* Personalized recommendations

All mock data is accessed through asynchronous service functions.

For example:

```ts
const workouts = await workoutService.getWorkouts()
```

Later, the implementation can change internally to:

```ts
const response = await api.get('/workouts')
return response.data
```

without changing the components that consume the service.

---

# Architecture Approach

GymAI separates UI components from data access.

```text
React Components
       │
       ▼
Service Layer
       │
       ├── Mock Data
       │
       └── Future API Endpoints
```

This approach allows the application to evolve from the current frontend-first implementation into a fully connected training platform without major component rewrites.

---

# Verification

The following functionality has been verified in the current build:

### Frontend

```bash
npm run build
```

The production build completes successfully with:

```text
TypeScript compilation
+
Vite production build
```

and no build errors.

### Backend

The authentication API has been tested end-to-end for:

* Successful registration
* Duplicate email rejection
* Successful login
* Invalid password rejection
* Accessing `/me` with a valid token
* Rejecting `/me` requests without authentication
* Logout endpoint

### Integration

CORS communication has been verified between:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
```

---

# Current Development Status

## Phase 1 — Completed

* Complete responsive frontend
* Landing page
* Authentication flow
* Real FastAPI backend
* JWT authentication
* Protected routes
* SQLite persistence
* PostgreSQL-ready configuration
* Dashboard UI
* Workout UI
* Exercise library
* Progress tracking UI
* History UI
* Profile and settings
* Motion interactions
* Evasive Login Button
* Service-layer abstraction

## Phase 2 — Planned

The next phase will introduce real training intelligence and AI-powered functionality.

Planned features include:

* AI workout generation
* AI fitness coach
* Adaptive training programs
* Personalized workout recommendations
* Readiness-based workout adjustments
* Training load analysis
* Real workout persistence
* Exercise and progress APIs
* Long-term training history
* Advanced analytics
* PostgreSQL deployment
* Production API deployment

---

# Vision

GymAI is designed to evolve beyond a traditional workout tracker.

The goal is to build a **training intelligence system** that can understand:

* How ready a user is to train
* How much training load they are accumulating
* How their performance changes over time
* Which workouts are appropriate for their current state
* How future programming should adapt

The current build establishes the product architecture, user experience, authentication foundation, and service boundaries required for that next phase.

---

# Development

Frontend build:

```bash
cd frontend
npm run build
```

Backend development server:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

---

# License

This project is currently intended for educational and portfolio purposes.

---

## GymAI

**Train smarter. Understand your readiness. Build better programs.**

*GymAI — Training Intelligence.*
