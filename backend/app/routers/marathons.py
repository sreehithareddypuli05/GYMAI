from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user
from app.services.notifications import generate_due_marathon_notifications

router = APIRouter(prefix="/api/marathons", tags=["marathons"])


@router.get("", response_model=list[schemas.MarathonEventOut])
def list_upcoming_marathons(
    db: Session = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=200),
    current_user: models.User = Depends(get_current_user),
):
    generate_due_marathon_notifications(db, user_id=current_user.id)

    now = datetime.now(timezone.utc)
    stmt = (
        select(models.MarathonEvent)
        .where(models.MarathonEvent.event_date >= now)
        .order_by(models.MarathonEvent.event_date.asc())
        .limit(limit)
    )
    rows = db.execute(stmt).scalars().all()
    return rows


@router.get("/{marathon_id}", response_model=schemas.MarathonEventOut)
def get_marathon(
    marathon_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = db.get(models.MarathonEvent, marathon_id)
    if not marathon:
        raise HTTPException(status_code=404, detail="Marathon not found")
    return marathon


@router.post("", response_model=schemas.MarathonEventOut, status_code=status.HTTP_201_CREATED)
def create_marathon(
    payload: schemas.MarathonEventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = models.MarathonEvent(**payload.model_dump())
    db.add(marathon)
    db.commit()
    db.refresh(marathon)
    return marathon


@router.delete("/{marathon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_marathon(
    marathon_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = db.get(models.MarathonEvent, marathon_id)
    if not marathon:
        raise HTTPException(status_code=404, detail="Marathon not found")
    db.delete(marathon)
    db.commit()
    return None


@router.get("/{marathon_id}/reminder", response_model=schemas.MarathonReminderOut | None)
def get_marathon_reminder(
    marathon_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = db.get(models.MarathonEvent, marathon_id)
    if not marathon:
        raise HTTPException(status_code=404, detail="Marathon not found")

    reminder = (
        db.query(models.MarathonReminder)
        .filter(
            models.MarathonReminder.user_id == current_user.id,
            models.MarathonReminder.marathon_id == marathon_id,
        )
        .first()
    )

    return reminder


@router.post("/{marathon_id}/reminder", response_model=schemas.MarathonReminderOut, status_code=status.HTTP_201_CREATED)
def create_marathon_reminder(
    marathon_id: str,
    payload: schemas.MarathonReminderCreate | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = db.get(models.MarathonEvent, marathon_id)
    if not marathon:
        raise HTTPException(status_code=404, detail="Marathon not found")

    existing = (
        db.query(models.MarathonReminder)
        .filter(
            models.MarathonReminder.user_id == current_user.id,
            models.MarathonReminder.marathon_id == marathon_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Reminder already exists")

    reminder = models.MarathonReminder(
        user_id=current_user.id,
        marathon_id=marathon_id,
        status=(payload.status if payload else "active"),
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


@router.delete("/{marathon_id}/reminder", status_code=status.HTTP_204_NO_CONTENT)
def delete_marathon_reminder(
    marathon_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = db.get(models.MarathonEvent, marathon_id)
    if not marathon:
        raise HTTPException(status_code=404, detail="Marathon not found")

    reminder = (
        db.query(models.MarathonReminder)
        .filter(
            models.MarathonReminder.user_id == current_user.id,
            models.MarathonReminder.marathon_id == marathon_id,
        )
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    db.delete(reminder)
    db.commit()
    return None


@router.get("/{marathon_id}/notifications", response_model=list[schemas.NotificationOut])
def list_marathon_notifications(
    marathon_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = db.get(models.MarathonEvent, marathon_id)
    if not marathon:
        raise HTTPException(status_code=404, detail="Marathon not found")

    notifications = (
        db.query(models.Notification)
        .filter(
            models.Notification.user_id == current_user.id,
            models.Notification.marathon_id == marathon_id,
        )
        .order_by(models.Notification.created_at.desc())
        .all()
    )

    return notifications


@router.post("/{marathon_id}/notifications/mark-read", response_model=schemas.NotificationOut)
def mark_marathon_notification_read(
    marathon_id: str,
    payload: schemas.NotificationMarkRead | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    marathon = db.get(models.MarathonEvent, marathon_id)
    if not marathon:
        raise HTTPException(status_code=404, detail="Marathon not found")

    notification = (
        db.query(models.Notification)
        .filter(
            models.Notification.user_id == current_user.id,
            models.Notification.marathon_id == marathon_id,
        )
        .order_by(models.Notification.created_at.desc())
        .first()
    )
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = bool(payload.is_read if payload else True)
    db.commit()
    db.refresh(notification)
    return notification


@router.post("/notifications/generate-due", response_model=list[schemas.NotificationOut])
def generate_due_notifications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    notifications = generate_due_marathon_notifications(db, user_id=current_user.id)
    return notifications
