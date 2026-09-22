import smtplib
from email.message import EmailMessage

from app.config import settings
from app.services.monitor import IncompleteWorkoutResult, MissedWorkingDayResult
from app import models


def _safe_sender():
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
        raise RuntimeError("SMTP email is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD.")
    return settings.smtp_from.strip() or settings.smtp_user.strip()


def send_password_reset_code(to_email: str, code: str) -> None:
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
        raise RuntimeError("SMTP email is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD.")

    sender = settings.smtp_from.strip() or settings.smtp_user.strip()

    message = EmailMessage()
    message["Subject"] = "GymAI password reset code"
    message["From"] = sender
    message["To"] = to_email
    message.set_content(
        f"""Hi,

We received a request to reset your GymAI password.

Your verification code is: {code}

This code expires in {settings.password_reset_expire_minutes} minutes. If you did not request a password reset, you can safely ignore this email.

— GymAI Security
"""
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
        if settings.smtp_use_tls:
            server.starttls()
        server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(message)


def send_incomplete_workout_reminder(to_email: str, result: IncompleteWorkoutResult) -> None:
    """Send a short reminder about an incomplete workout session."""
    try:
        sender = _safe_sender()
    except RuntimeError:
        # SMTP not configured; fail silently for now to avoid crashing callers
        return

    if not to_email:
        return

    message = EmailMessage()
    message["Subject"] = "You have an incomplete workout — GymAI"
    message["From"] = sender
    message["To"] = to_email
    message.set_content(
        f"""Hi,

It looks like you started a workout on {result.date.isoformat()} ({result.workout_name}) but it wasn't fully completed.

Progress: {result.completion}% complete
Exercises: {result.exercise_count}
Duration: {result.duration_minutes} minutes

If you'd like to finish this session, open GymAI and continue where you left off.

— GymAI
"""
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
    except Exception:
        # Don't raise; caller should handle logging if desired
        return


def send_missed_working_day_reminder(to_email: str, result: MissedWorkingDayResult) -> None:
    """Send a reminder that the user missed a scheduled working day."""
    try:
        sender = _safe_sender()
    except RuntimeError:
        return

    if not to_email:
        return

    message = EmailMessage()
    message["Subject"] = f"Missed training day: {result.weekday} — GymAI"
    message["From"] = sender
    message["To"] = to_email
    sessions_text = ", ".join(result.sessions) if result.sessions else "none"
    message.set_content(
        f"""Hi,

You had {result.weekday} marked as a training day, but we didn't detect a completed workout on {result.date.isoformat()}.

Completed sessions found on that day: {sessions_text}

If you'd still like to train today, open GymAI to start your session.

— GymAI
"""
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
    except Exception:
        return


def send_workout_reminders(db, user, day_date=None, now=None):
    """High-level helper: check monitor and send appropriate reminders.

    - `db` is a SQLAlchemy Session
    - `user` is a models.User
    - `day_date` (optional) is the date to check for missed working day (defaults to yesterday)
    - `now` (optional) is the current datetime for testing
    """
    # defensive: require email
    if not getattr(user, 'email', None):
        return

    # find incomplete workouts
    try:
        incomplete = []
        from app.services.monitor import find_incomplete_workouts, check_missed_working_day
        incomplete = find_incomplete_workouts(db, user)
    except Exception:
        incomplete = []

    # Send one email per incomplete session (avoid duplicates within this call)
    sent_incomplete = set()
    for item in incomplete:
        if item.session_id in sent_incomplete:
            continue
        send_incomplete_workout_reminder(user.email, item)
        sent_incomplete.add(item.session_id)

    # Check missed working day
    try:
        from datetime import timedelta, date
        if day_date is None:
            # default check for yesterday
            today = (now or datetime.now(timezone.utc)).astimezone(timezone.utc).date()
            day_date = today - timedelta(days=1)

        missed = check_missed_working_day(db, user, day_date, now=now)
        if missed.missed:
            send_missed_working_day_reminder(user.email, missed)
    except Exception:
        return


def _record_reminder(db, user_id: str, rtype: str, ref_id: str | None = None) -> bool:
    """Persist a reminder record. Returns True if created, False if already exists."""
    try:
        reminder = models.ReminderSent(user_id=user_id, type=rtype, ref_id=ref_id)
        db.add(reminder)
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False
