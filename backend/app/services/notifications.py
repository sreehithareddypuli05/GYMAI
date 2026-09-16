from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app import models

DEFAULT_REMINDER_WINDOW_DAYS = 7


def _normalize_to_utc(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def generate_due_marathon_notifications(
    db: Session,
    user_id: str | None = None,
    reminder_window_days: int = DEFAULT_REMINDER_WINDOW_DAYS,
) -> list[models.Notification]:
    """Create in-app notifications for active marathon reminders that are due."""
    now = datetime.now(timezone.utc)
    reminder_window = timedelta(days=reminder_window_days)

    query = (
        db.query(models.MarathonReminder)
        .filter(models.MarathonReminder.status == "active")
        .join(models.MarathonEvent)
    )

    if user_id is not None:
        query = query.filter(models.MarathonReminder.user_id == user_id)

    reminders = query.all()
    created: list[models.Notification] = []

    for reminder in reminders:
        marathon = reminder.marathon
        if marathon is None:
            continue

        event_date = _normalize_to_utc(marathon.event_date)
        if event_date is None:
            continue

        delta = event_date - now
        if delta <= timedelta(0):
            continue

        if delta > reminder_window:
            continue

        existing = (
            db.query(models.Notification)
            .filter(
                models.Notification.user_id == reminder.user_id,
                models.Notification.marathon_id == marathon.id,
                models.Notification.notification_type == "marathon_reminder",
            )
            .first()
        )
        if existing is not None:
            continue

        days_until = max(1, (event_date.date() - now.date()).days)
        notification = models.Notification(
            user_id=reminder.user_id,
            marathon_id=marathon.id,
            title="Marathon reminder",
            message=f"{marathon.name} is coming up in {days_until} day(s).",
            notification_type="marathon_reminder",
            is_read=False,
        )
        db.add(notification)
        created.append(notification)

    db.commit()
    for notification in created:
        db.refresh(notification)
    return created
