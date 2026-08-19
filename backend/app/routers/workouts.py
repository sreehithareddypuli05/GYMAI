from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user


router = APIRouter(
    prefix="/api/workouts",
    tags=["workouts"],
)


@router.post(
    "/complete",
    response_model=schemas.WorkoutSessionOut,
)
def complete_workout(
    payload: schemas.WorkoutSessionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = models.WorkoutSession(
        user_id=current_user.id,
        workout_id=payload.workout_id,
        workout_name=payload.workout_name,
        focus=payload.focus,
        duration_minutes=payload.duration_minutes,
        exercise_count=payload.exercise_count,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session