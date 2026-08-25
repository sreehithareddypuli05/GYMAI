from collections import defaultdict
from datetime import timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user

router = APIRouter(prefix="/api/history", tags=["history"])

@router.get("", response_model=list[schemas.HistoryEntryOut])
def get_history(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = (db.query(models.WorkoutSession)
        .filter(models.WorkoutSession.user_id == current_user.id)
        .order_by(models.WorkoutSession.completed_at.desc()).all())

    pose_sessions = (db.query(models.PoseSession)
        .filter(models.PoseSession.user_id == current_user.id).all())
    # A pose session is attached to the workout chronologically because older
    # local databases do not have a pose->workout foreign key yet.
    pose_by_day = defaultdict(list)
    for pose in pose_sessions:
        value = pose.created_at
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        pose_by_day[value.date()].append(pose.form_score)

    result = []
    for session in sessions:
        total = session.total_sets or 0
        completed = session.completed_sets or 0
        completion = round((completed / total) * 100) if total else (100 if session.exercise_count else 0)
        value = session.completed_at
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        scores = pose_by_day.get(value.date(), [])
        result.append(schemas.HistoryEntryOut(
            id=session.id, workoutName=session.workout_name, date=value.strftime('%d %b %Y'),
            durationMinutes=session.duration_minutes, exerciseCount=session.exercise_count,
            completion=max(0, min(100, completion)), focus=session.focus, totalSets=total,
            completedSets=completed, formScore=round(sum(scores)/len(scores), 1) if scores else None,
        ))
    return result
