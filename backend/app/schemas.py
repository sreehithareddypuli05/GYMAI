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
# Training profile
# --------------------------------

class ProfileUpdate(BaseModel):
    age: int | None = Field(default=None, ge=13, le=120)
    height_cm: float | None = Field(default=None, ge=50, le=300)
    weight_kg: float | None = Field(default=None, ge=20, le=500)
    goal: str | None = None
    fitness_level: str | None = None
    equipment: list[str] | None = None
    training_frequency: int | None = Field(default=None, ge=1, le=7)


class ProfileCompletionOut(BaseModel):
    completion: int
    completed_fields: int
    total_fields: int
    missing_fields: list[str]
    profile_completed: bool


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

class WorkoutExercisePerformance(BaseModel):
    exercise_id: str
    name: str
    planned_sets: int = Field(ge=1, le=20)
    completed_sets: int = Field(ge=0, le=20)
    planned_reps: str
    completed: bool = False


class WorkoutSessionCreate(BaseModel):
    workout_id: str
    workout_name: str
    focus: str | None = None
    duration_minutes: int = Field(ge=1, le=600)
    exercise_count: int = Field(ge=0, le=100)
    total_sets: int = Field(default=0, ge=0, le=500)
    completed_sets: int = Field(default=0, ge=0, le=500)
    completed_exercises: list[WorkoutExercisePerformance] = Field(default_factory=list)


class WorkoutSessionOut(BaseModel):
    id: str

    workout_id: str

    workout_name: str

    focus: str | None

    duration_minutes: int

    exercise_count: int

    total_sets: int = 0
    completed_sets: int = 0
    completed_exercises: list[dict] = Field(default_factory=list)

    completed_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# --------------------------------
# Beginner pose analysis
# --------------------------------

class PoseSessionCreate(BaseModel):
    exercise_id: str
    exercise_name: str
    pose_type: str
    reps: int = Field(ge=0, le=500)
    form_score: float = Field(ge=0, le=100)
    feedback: str = Field(default="", max_length=300)


class PoseSessionOut(BaseModel):
    id: str
    exercise_id: str
    exercise_name: str
    pose_type: str
    reps: int
    form_score: float
    feedback: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


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
    focus: str | None = None
    totalSets: int = 0
    completedSets: int = 0
    formScore: float | None = None


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
    totalWorkouts: int = 0
    totalMinutes: int = 0
    totalSets: int = 0
    completedSets: int = 0
    averageFormScore: float | None = None
    bestFormScore: float | None = None
    poseSessions: int = 0
    volumeByWeek: list[ProgressPoint]
    frequencyByWeek: list[ProgressPoint]
    strengthProgression: list[ProgressPoint]
    muscleDistribution: list[ProgressPoint]
    setsByWeek: list[ProgressPoint] = []
    formByWeek: list[ProgressPoint] = []

class ExerciseOut(BaseModel):
    id: str
    slug: str
    name: str
    muscle_group: str
    equipment: str
    difficulty: str
    sets: int
    reps: str
    rest_seconds: int
    description: str
    cues: list[str]
    common_mistakes: list[str]
    goal_tags: list[str]
    image_url: str
    image_urls: list[str] = []
    pose_supported: bool
    pose_type: str | None = None
    model_config = ConfigDict(from_attributes=True)


# --------------------------------
# Personalized workouts
# --------------------------------

class WorkoutExerciseOut(BaseModel):
    id: str
    slug: str
    name: str
    muscle_group: str
    equipment: str
    difficulty: str
    sets: int
    reps: str
    rest_seconds: int
    description: str
    cues: list[str]
    common_mistakes: list[str]
    goal_tags: list[str]
    image_url: str
    image_urls: list[str] = []
    pose_supported: bool
    pose_type: str | None = None


class PersonalizedWorkoutOut(BaseModel):
    id: str
    name: str
    focus: str
    duration_minutes: int
    difficulty: str
    exercises: list[WorkoutExerciseOut]
    profile_summary: dict[str, str]
