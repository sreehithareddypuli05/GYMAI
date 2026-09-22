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


# Simple in-process reminder worker. Minimal and safe for single-process
# development setups. It periodically scans users and sends reminders.
def _run_reminder_loop():
    import time
    from datetime import datetime, timezone, timedelta
    from app.database import SessionLocal
    from app.services import email as email_service
    from app.services.monitor import find_incomplete_workouts, check_missed_working_day

    interval = max(10, settings.reminder_interval_seconds)

    while True:
        with SessionLocal() as db:
            try:
                users = db.query(models.User).all()
                now = datetime.now(timezone.utc)
                yesterday = (now - timedelta(days=1)).date()

                for user in users:
                    # Skip users without email
                    if not getattr(user, 'email', None):
                        continue

                    # Incomplete workouts: send one reminder per session only once
                    try:
                        incomplete = find_incomplete_workouts(db, user)
                        for item in incomplete:
                            # check if we've already recorded a reminder
                            exists = db.query(models.ReminderSent).filter_by(user_id=user.id, type='incomplete', ref_id=item.session_id).first()
                            if exists:
                                continue
                            try:
                                db.add(models.ReminderSent(user_id=user.id, type='incomplete', ref_id=item.session_id))
                                db.commit()
                                email_service.send_incomplete_workout_reminder(user.email, item)
                            except Exception:
                                db.rollback()
                                continue
                    except Exception:
                        # protect per-user loop
                        continue

                    # Missed working day: check for yesterday
                    try:
                        missed = check_missed_working_day(db, user, yesterday, now=now)
                        if missed.missed:
                            ref = f"missed-{yesterday.isoformat()}"
                            exists = db.query(models.ReminderSent).filter_by(user_id=user.id, type='missed', ref_id=ref).first()
                            if exists:
                                continue
                            try:
                                db.add(models.ReminderSent(user_id=user.id, type='missed', ref_id=ref))
                                db.commit()
                                email_service.send_missed_working_day_reminder(user.email, missed)
                            except Exception:
                                db.rollback()
                                continue
                    except Exception:
                        continue
            except Exception:
                # keep the loop alive on unexpected errors
                pass

        # use event.wait so shutdown can interrupt sleep
        stop_event = globals().get("_reminder_stop_event")
        if stop_event is not None:
            stop_event.wait(interval)
            if stop_event.is_set():
                break
        else:
            import time
            time.sleep(interval)


# Reminder thread handles (initialized on startup)
_reminder_thread = None
_reminder_stop_event = None


def _start_reminder_worker():
    import threading

    global _reminder_thread, _reminder_stop_event

    # Only start if SMTP is configured
    if not (settings.smtp_host and settings.smtp_user and settings.smtp_password):
        return

    if _reminder_thread and _reminder_thread.is_alive():
        return

    _reminder_stop_event = threading.Event()
    _reminder_thread = threading.Thread(target=_run_reminder_loop, daemon=True)
    _reminder_thread.start()


def _stop_reminder_worker(timeout: float = 5.0):
    global _reminder_thread, _reminder_stop_event
    if not _reminder_thread:
        return
    try:
        if _reminder_stop_event:
            _reminder_stop_event.set()
        _reminder_thread.join(timeout)
    finally:
        _reminder_thread = None
        _reminder_stop_event = None


@app.on_event("startup")
def _on_startup():
    _start_reminder_worker()


@app.on_event("shutdown")
def _on_shutdown():
    _stop_reminder_worker()