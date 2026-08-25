from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user
from app.services.recommendation import build_recommendation
from app.routers.exercises import serialize as serialize_exercise

router = APIRouter(
    prefix="/api/workouts",
    tags=["workouts"],
)


@router.get("/today", response_model=schemas.PersonalizedWorkoutOut)
def get_today_workout(
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recommendation = build_recommendation(db, current_user)
    if not recommendation:
        raise HTTPException(status_code=422, detail="Complete your profile and choose equipment before starting a workout.")

    serialized = [serialize_exercise(row, request) for row in recommendation.exercises]
    difficulty = current_user.fitness_level or "Beginner"
    frequency = current_user.training_frequency or 3
    duration = max(20, len(serialized) * (6 if frequency >= 5 else 7))

    return schemas.PersonalizedWorkoutOut(
        id=f"profile-{current_user.id}-{current_user.goal}-{current_user.fitness_level}",
        name="Today's Personalized Training",
        focus=recommendation.focus,
        duration_minutes=duration,
        difficulty=difficulty,
        exercises=[schemas.WorkoutExerciseOut(**item.model_dump()) for item in serialized],
        profile_summary={
            "goal": current_user.goal or "General Fitness",
            "fitness_level": current_user.fitness_level or "Beginner",
            "equipment": ", ".join(current_user.equipment or []),
            "training_frequency": f"{frequency} days/week",
        },
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
        total_sets=payload.total_sets,
        completed_sets=payload.completed_sets,
        completed_exercises=[item.model_dump() for item in payload.completed_exercises],
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.post("/pose-session", response_model=schemas.PoseSessionOut)
def save_pose_session(
    payload: schemas.PoseSessionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Pose analysis is intentionally available only to beginner users.
    if current_user.fitness_level != "Beginner":
        raise HTTPException(status_code=403, detail="Pose analysis is available for Beginner training only.")

    exercise = db.query(models.Exercise).filter(models.Exercise.id == payload.exercise_id).first()
    if not exercise or not exercise.pose_supported:
        raise HTTPException(status_code=422, detail="This exercise does not support pose analysis.")

    session = models.PoseSession(
        user_id=current_user.id,
        exercise_id=payload.exercise_id,
        exercise_name=payload.exercise_name,
        pose_type=payload.pose_type,
        reps=payload.reps,
        form_score=payload.form_score,
        feedback=payload.feedback,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session
