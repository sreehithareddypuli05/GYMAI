from datetime import datetime

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    ConfigDict,
)


# --------------------------------
# User
# --------------------------------

class UserBase(BaseModel):
    full_name: str = Field(
        min_length=1,
        max_length=120,
    )

    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(
        min_length=6,
        max_length=128,
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=120,
    )

    avatar_url: str | None = None

    fitness_level: str | None = None

    goal: str | None = None

    training_frequency: int | None = Field(
        default=None,
        ge=1,
        le=7,
    )

    equipment: list[str] | None = None

    age: int | None = Field(
        default=None,
        ge=13,
        le=120,
    )

    height_cm: float | None = Field(
        default=None,
        ge=50,
        le=300,
    )

    weight_kg: float | None = Field(
        default=None,
        ge=20,
        le=500,
    )

    profile_completed: bool | None = None


class UserOut(UserBase):
    id: str

    avatar_url: str | None = None

    fitness_level: str | None = None

    goal: str | None = None

    training_frequency: int | None = None

    equipment: list[str] | None = None

    age: int | None = None

    height_cm: float | None = None

    weight_kg: float | None = None

    profile_completed: bool = False

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class TokenResponse(BaseModel):
    access_token: str

    token_type: str = "bearer"

    user: UserOut


# --------------------------------
# Password
# --------------------------------

class PasswordChange(BaseModel):
    current_password: str = Field(
        min_length=6,
        max_length=128,
    )

    new_password: str = Field(
        min_length=6,
        max_length=128,
    )


# --------------------------------
# Workout tracking
# --------------------------------

class WorkoutSessionCreate(BaseModel):
    workout_id: str

    workout_name: str

    focus: str | None = None

    duration_minutes: int = Field(
        ge=1,
        le=600,
    )

    exercise_count: int = Field(
        ge=1,
        le=100,
    )


class WorkoutSessionOut(BaseModel):
    id: str

    workout_id: str

    workout_name: str

    focus: str | None

    duration_minutes: int

    exercise_count: int

    completed_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# --------------------------------
# Dashboard
# --------------------------------

class ActivityPoint(BaseModel):
    label: str

    sessions: int

    minutes: int


class DashboardOut(BaseModel):
    current_streak: int

    longest_streak: int

    workouts_this_week: int

    total_workouts: int

    minutes_this_week: int

    activity: list[ActivityPoint]

    recent_workouts: list[WorkoutSessionOut]


# --------------------------------
# History
# --------------------------------

class HistoryEntryOut(BaseModel):
    id: str

    workoutName: str

    date: str

    durationMinutes: int

    exerciseCount: int

    completion: int


# --------------------------------
# Progress
# --------------------------------

class ProgressPoint(BaseModel):
    label: str

    value: float


class ProgressOut(BaseModel):
    completionRate: int

    currentStreak: int

    longestStreak: int

    sessionsPerWeek: float

    volumeByWeek: list[ProgressPoint]

    frequencyByWeek: list[ProgressPoint]

    strengthProgression: list[ProgressPoint]

    muscleDistribution: list[ProgressPoint]