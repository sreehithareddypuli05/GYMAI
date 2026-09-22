from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List

from sqlalchemy.orm import Session

from app import models


def _utc_date(value: datetime) -> datetime.date:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).date()


def _session_completion(session: models.WorkoutSession) -> int:
    # Mirror the completion logic used in history router
    total = session.total_sets or 0
    completed = session.completed_sets or 0
    if total:
        completion = round((completed / total) * 100)
    else:
        completion = 100 if session.exercise_count else 0
    return max(0, min(100, completion))


@dataclass
class IncompleteWorkoutResult:
    session_id: str
    user_id: str
    workout_name: str
    date: datetime.date
    completion: int
    duration_minutes: int
    exercise_count: int
    total_sets: int
    completed_sets: int


def find_incomplete_workouts(db: Session, user: models.User) -> List[IncompleteWorkoutResult]:
    """Return a list of incomplete workout sessions for a user.

    A session is considered incomplete if its computed completion < 100.
    This reuses the project's existing completion calculation.
    """
    rows = (
        db.query(models.WorkoutSession)
        .filter(models.WorkoutSession.user_id == user.id)
        .order_by(models.WorkoutSession.completed_at.desc())
        .all()
    )

    result: List[IncompleteWorkoutResult] = []
    for s in rows:
        completion = _session_completion(s)
        if completion < 100:
            result.append(IncompleteWorkoutResult(
                session_id=s.id,
                user_id=s.user_id,
                workout_name=s.workout_name,
                date=_utc_date(s.completed_at),
                completion=completion,
                duration_minutes=s.duration_minutes,
                exercise_count=s.exercise_count,
                total_sets=s.total_sets or 0,
                completed_sets=s.completed_sets or 0,
            ))

    return result


@dataclass
class MissedWorkingDayResult:
    user_id: str
    date: datetime.date
    weekday: str
    missed: bool
    sessions: List[str]


def check_missed_working_day(db: Session, user: models.User, day_date: datetime.date, now: datetime | None = None) -> MissedWorkingDayResult:
    """Check whether a user's selected working day was missed.

    Conditions for missed:
    - the weekday name is present in user's `working_days` (case-sensitive canonical names expected)
    - the day has ended (UTC day < now UTC date)
    - there is no completed workout for that user on that date (completion == 100)
    """
    if now is None:
        now = datetime.now(timezone.utc)

    weekday = day_date.strftime("%A")

    # Safely handle users with no working_days
    if not user.working_days or not isinstance(user.working_days, list):
        return MissedWorkingDayResult(user_id=user.id, date=day_date, weekday=weekday, missed=False, sessions=[])

    if weekday not in user.working_days:
        return MissedWorkingDayResult(user_id=user.id, date=day_date, weekday=weekday, missed=False, sessions=[])

    # If the day has not ended in UTC, it's not missed yet
    if day_date >= now.astimezone(timezone.utc).date():
        return MissedWorkingDayResult(user_id=user.id, date=day_date, weekday=weekday, missed=False, sessions=[])

    # Find sessions on that date
    sessions = (
        db.query(models.WorkoutSession)
        .filter(models.WorkoutSession.user_id == user.id)
        .all()
    )

    sessions_on_date = [s for s in sessions if _utc_date(s.completed_at) == day_date]

    # If any session on that date has completion == 100, it's not missed
    for s in sessions_on_date:
        if _session_completion(s) >= 100:
            return MissedWorkingDayResult(user_id=user.id, date=day_date, weekday=weekday, missed=False, sessions=[s.id for s in sessions_on_date])

    # Otherwise it's missed
    return MissedWorkingDayResult(user_id=user.id, date=day_date, weekday=weekday, missed=True, sessions=[s.id for s in sessions_on_date])
