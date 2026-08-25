import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    String,
    DateTime,
    Integer,
    Float,
    Boolean,
    JSON,
    ForeignKey,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=_uuid,
    )

    full_name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    fitness_level: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    goal: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    training_frequency: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    equipment: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    # New profile fields
    age: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    height_cm: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    weight_kg: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    profile_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_now,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_now,
        onupdate=_now,
    )

    workout_sessions: Mapped[list["WorkoutSession"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=_uuid,
    )

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    workout_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    workout_name: Mapped[str] = mapped_column(
        String(160),
        nullable=False,
    )

    focus: Mapped[str | None] = mapped_column(
        String(160),
        nullable=True,
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    exercise_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    completed_exercises: Mapped[list | None] = mapped_column(JSON, nullable=True)
    total_sets: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    completed_sets: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_now,
        nullable=False,
        index=True,
    )

    user: Mapped["User"] = relationship(
        back_populates="workout_sessions",
    )

class Exercise(Base):
    __tablename__ = "exercises"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    muscle_group: Mapped[str] = mapped_column(String(80), nullable=False)
    equipment: Mapped[str] = mapped_column(String(50), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    sets: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    reps: Mapped[str] = mapped_column(String(40), nullable=False)
    rest_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=60)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    cues: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    common_mistakes: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    goal_tags: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    image_key: Mapped[str] = mapped_column(String(160), nullable=False)
    pose_supported: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    pose_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class PoseSession(Base):
    __tablename__ = "pose_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    exercise_id: Mapped[str] = mapped_column(String(36), nullable=False)
    exercise_name: Mapped[str] = mapped_column(String(160), nullable=False)
    pose_type: Mapped[str] = mapped_column(String(50), nullable=False)
    reps: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    form_score: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    feedback: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, nullable=False, index=True)
