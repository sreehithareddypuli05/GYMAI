from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user


router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
)


def utc_day(value: datetime) -> datetime.date:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)

    return value.astimezone(timezone.utc).date()


def calculate_streak(
    sessions: list[models.WorkoutSession],
) -> tuple[int, int]:

    if not sessions:
        return 0, 0

    days = {
        utc_day(session.completed_at)
        for session in sessions
    }

    if not days:
        return 0, 0

    today = datetime.now(timezone.utc).date()

    # Current streak must include today or yesterday.
    if today in days:
        cursor = today
    elif today - timedelta(days=1) in days:
        cursor = today - timedelta(days=1)
    else:
        current = 0
        longest = calculate_longest_streak(days)
        return current, longest

    current = 0

    while cursor in days:
        current += 1
        cursor -= timedelta(days=1)

    longest = calculate_longest_streak(days)

    return current, longest


def calculate_longest_streak(
    days: set,
) -> int:

    if not days:
        return 0

    ordered = sorted(days)

    longest = 1
    running = 1

    for index in range(1, len(ordered)):
        if ordered[index] == ordered[index - 1] + timedelta(days=1):
            running += 1
        else:
            running = 1

        longest = max(longest, running)

    return longest


@router.get(
    "",
    response_model=schemas.DashboardOut,
)
def get_dashboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(models.WorkoutSession)
        .filter(
            models.WorkoutSession.user_id == current_user.id
        )
        .order_by(
            models.WorkoutSession.completed_at.desc()
        )
        .all()
    )

    current_streak, longest_streak = calculate_streak(
        sessions
    )

    now = datetime.now(timezone.utc)

    week_start = (
        now - timedelta(days=now.weekday())
    ).date()

    week_sessions = [
        session
        for session in sessions
        if utc_day(session.completed_at) >= week_start
    ]

    activity = []

    for offset in range(7):
        day = week_start + timedelta(days=offset)

        day_sessions = [
            session
            for session in sessions
            if utc_day(session.completed_at) == day
        ]

        activity.append(
            schemas.ActivityPoint(
                label=day.strftime("%a"),
                sessions=len(day_sessions),
                minutes=sum(
                    session.duration_minutes
                    for session in day_sessions
                ),
            )
        )

    return schemas.DashboardOut(
        current_streak=current_streak,
        longest_streak=longest_streak,
        workouts_this_week=len(week_sessions),
        total_workouts=len(sessions),
        minutes_this_week=sum(
            session.duration_minutes
            for session in week_sessions
        ),
        activity=activity,
        recent_workouts=sessions[:5],
    )