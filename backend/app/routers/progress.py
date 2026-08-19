from collections import Counter
from datetime import (
    datetime,
    timedelta,
    timezone,
)

from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user


router = APIRouter(
    prefix="/api/progress",
    tags=["progress"],
)


def utc_day(
    value: datetime,
):
    if value.tzinfo is None:
        value = value.replace(
            tzinfo=timezone.utc,
        )

    return value.astimezone(
        timezone.utc,
    ).date()


def calculate_longest_streak(
    days: set,
) -> int:
    if not days:
        return 0

    ordered = sorted(days)

    longest = 1
    current = 1

    for index in range(
        1,
        len(ordered),
    ):
        previous = ordered[
            index - 1
        ]

        day = ordered[index]

        if day == previous + timedelta(
            days=1,
        ):
            current += 1
        else:
            current = 1

        longest = max(
            longest,
            current,
        )

    return longest


def calculate_current_streak(
    days: set,
) -> int:
    if not days:
        return 0

    today = datetime.now(
        timezone.utc,
    ).date()

    yesterday = today - timedelta(
        days=1,
    )

    if today in days:
        cursor = today

    elif yesterday in days:
        cursor = yesterday

    else:
        return 0

    streak = 0

    while cursor in days:
        streak += 1

        cursor -= timedelta(
            days=1,
        )

    return streak


@router.get(
    "",
    response_model=schemas.ProgressOut,
)
def get_progress(
    current_user: models.User = Depends(
        get_current_user,
    ),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(
            models.WorkoutSession,
        )
        .filter(
            models.WorkoutSession.user_id
            == current_user.id
        )
        .order_by(
            models.WorkoutSession.completed_at.asc()
        )
        .all()
    )


    # -----------------------------
    # Streak calculations
    # -----------------------------

    workout_days = {
        utc_day(
            session.completed_at,
        )
        for session in sessions
    }

    current_streak = (
        calculate_current_streak(
            workout_days,
        )
    )

    longest_streak = (
        calculate_longest_streak(
            workout_days,
        )
    )


    # -----------------------------
    # Last 8 weeks
    # -----------------------------

    today = datetime.now(
        timezone.utc,
    ).date()

    current_week_start = (
        today
        - timedelta(
            days=today.weekday(),
        )
    )

    week_starts = [
        current_week_start
        - timedelta(
            weeks=7 - index,
        )
        for index in range(8)
    ]


    volume_by_week = []

    frequency_by_week = []

    consistency_by_week = []


    for week_start in week_starts:

        week_end = (
            week_start
            + timedelta(days=7)
        )

        week_sessions = [
            session
            for session in sessions
            if week_start
            <= utc_day(
                session.completed_at,
            )
            < week_end
        ]


        total_minutes = sum(
            session.duration_minutes
            for session in week_sessions
        )


        session_count = len(
            week_sessions,
        )


        active_days = len(
            {
                utc_day(
                    session.completed_at,
                )
                for session in week_sessions
            }
        )


        label = week_start.strftime(
            "%d %b",
        )


        volume_by_week.append(
            schemas.ProgressPoint(
                label=label,
                value=float(
                    total_minutes,
                ),
            )
        )


        frequency_by_week.append(
            schemas.ProgressPoint(
                label=label,
                value=float(
                    session_count,
                ),
            )
        )


        consistency_percentage = (
            active_days / 7
        ) * 100


        consistency_by_week.append(
            schemas.ProgressPoint(
                label=label,
                value=round(
                    consistency_percentage,
                    1,
                ),
            )
        )


    # -----------------------------
    # Workout focus distribution
    # -----------------------------

    focus_counter = Counter()

    for session in sessions:

        focus = (
            session.focus
            or "General training"
        )

        focus_counter[
            focus
        ] += 1


    muscle_distribution = []


    total_sessions = len(
        sessions,
    )


    if total_sessions > 0:

        for (
            focus,
            count,
        ) in focus_counter.most_common():

            percentage = (
                count
                / total_sessions
            ) * 100


            muscle_distribution.append(
                schemas.ProgressPoint(
                    label=focus,
                    value=round(
                        percentage,
                        1,
                    ),
                )
            )


    # -----------------------------
    # Completion rate
    # -----------------------------

    if current_user.training_frequency:

        weeks_since_account_creation = max(
            1,
            (
                today
                - utc_day(
                    current_user.created_at,
                )
            ).days
            // 7
            + 1,
        )

        expected_sessions = (
            weeks_since_account_creation
            * current_user.training_frequency
        )

        completion_rate = min(
            100,
            round(
                (
                    len(sessions)
                    / max(
                        expected_sessions,
                        1,
                    )
                )
                * 100
            ),
        )

    else:

        completion_rate = 0


    # -----------------------------
    # Average sessions per week
    # -----------------------------

    if sessions:

        first_workout_date = utc_day(
            sessions[0].completed_at,
        )

        total_days = max(
            1,
            (
                today
                - first_workout_date
            ).days
            + 1,
        )

        total_weeks = max(
            1,
            total_days / 7,
        )

        sessions_per_week = round(
            len(sessions)
            / total_weeks,
            1,
        )

    else:

        sessions_per_week = 0


    return schemas.ProgressOut(
        completionRate=completion_rate,

        currentStreak=current_streak,

        longestStreak=longest_streak,

        sessionsPerWeek=sessions_per_week,

        volumeByWeek=volume_by_week,

        frequencyByWeek=frequency_by_week,

        strengthProgression=consistency_by_week,

        muscleDistribution=muscle_distribution,
    )