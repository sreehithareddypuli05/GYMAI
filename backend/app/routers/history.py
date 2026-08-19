from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user


router = APIRouter(
    prefix="/api/history",
    tags=["history"],
)


@router.get(
    "",
    response_model=list[schemas.HistoryEntryOut],
)
def get_history(
    current_user: models.User = Depends(
        get_current_user,
    ),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(models.WorkoutSession)
        .filter(
            models.WorkoutSession.user_id
            == current_user.id
        )
        .order_by(
            models.WorkoutSession.completed_at.desc()
        )
        .all()
    )

    return [
        schemas.HistoryEntryOut(
            id=session.id,
            workoutName=session.workout_name,
            date=session.completed_at.isoformat(),
            durationMinutes=session.duration_minutes,
            exerciseCount=session.exercise_count,
            completion=100,
        )
        for session in sessions
    ]