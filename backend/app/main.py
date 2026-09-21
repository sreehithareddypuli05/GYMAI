from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, text

from app.config import settings
from app.database import Base, engine

from app import models
from app.seed_exercises import seed_exercises

from app.routers import (
    auth,
    dashboard,
    workouts,
    history,
    progress,
    profile,
    exercises,
)


Base.metadata.create_all(
    bind=engine,
)


def _upgrade_workout_sessions_schema() -> None:
    """Small backwards-compatible migration for existing local databases.

    The project uses create_all for its lightweight development setup, which
    does not add columns to an already-created table. These additions keep
    existing GymAI databases usable after upgrading the workout tracker.
    """
    inspector = inspect(engine)
    columns = {column["name"] for column in inspector.get_columns("workout_sessions")}
    additions = {
        "completed_exercises": "JSON",
        "total_sets": "INTEGER NOT NULL DEFAULT 0",
        "completed_sets": "INTEGER NOT NULL DEFAULT 0",
    }
    with engine.begin() as connection:
        for name, definition in additions.items():
            if name not in columns:
                connection.execute(text(
                    f"ALTER TABLE workout_sessions ADD COLUMN {name} {definition}"
                ))


_upgrade_workout_sessions_schema()

from app.database import SessionLocal
with SessionLocal() as _seed_db:
    seed_exercises(_seed_db)


app = FastAPI(
    title="GymAI API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(workouts.router)
app.include_router(history.router)
app.include_router(progress.router)
app.include_router(profile.router)
app.include_router(exercises.router)

app.mount("/media", StaticFiles(directory="app/static"), name="media")


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "GymAI API",
    }