from dataclasses import dataclass
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models


@dataclass
class RecommendationResult:
    exercises: list[models.Exercise]
    focus: str


GOAL_MUSCLES = {
    'Build Muscle': ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
    'Gain Strength': ['Legs', 'Back', 'Chest', 'Shoulders'],
    'Lose Fat': ['Full Body', 'Legs', 'Core', 'Back'],
    'Improve Endurance': ['Full Body', 'Legs', 'Core', 'Shoulders'],
    'General Fitness': ['Full Body', 'Legs', 'Back', 'Chest', 'Core'],
}

FOCUS = {
    'Build Muscle': 'Muscle building',
    'Gain Strength': 'Strength',
    'Lose Fat': 'Full-body conditioning',
    'Improve Endurance': 'Endurance',
    'General Fitness': 'General fitness',
}


def _equipment_allowed(exercise: models.Exercise, equipment: list[str]) -> bool:
    if not equipment:
        return False
    if 'None' in equipment:
        return exercise.equipment == 'None'
    if 'Full Gym' in equipment:
        return exercise.equipment != 'None'
    return exercise.equipment in set(equipment)


def build_recommendation(db: Session, user: models.User) -> RecommendationResult | None:
    if not user.profile_completed or not user.fitness_level or not user.goal or not user.equipment:
        return None

    # Age/weight remain part of the user's training profile, but are not used
    # to rank or judge bodies. Exercise selection is driven by goal, level,
    # equipment and sustainable training frequency.
    if user.fitness_level in {'Intermediate', 'Advanced'} and 'None' in user.equipment:
        return None

    rows = db.execute(select(models.Exercise)).scalars().all()
    usable = [
        row for row in rows
        if row.difficulty == user.fitness_level and _equipment_allowed(row, user.equipment)
    ]

    if not usable:
        usable = [
            row for row in rows
            if row.difficulty == user.fitness_level and _equipment_allowed(row, user.equipment)
        ]

    preferred = GOAL_MUSCLES.get(user.goal, GOAL_MUSCLES['General Fitness'])

    def score(row: models.Exercise) -> int:
        value = 0
        if row.muscle_group in preferred:
            value += 8
        if row.muscle_group == 'Full Body':
            value += 4
        if user.goal in (row.goal_tags or []):
            value += 6
        if row.pose_supported and user.fitness_level == 'Beginner':
            value += 2
        return value

    ranked = sorted(usable, key=lambda row: (-score(row), row.name))
    selected: list[models.Exercise] = []
    seen_groups: set[str] = set()

    # Match the user's training frequency with a modest, repeatable session.
    target = 4 if (user.training_frequency or 3) <= 2 else 5

    for row in ranked:
        if len(selected) >= target:
            break
        if row.muscle_group not in seen_groups:
            selected.append(row)
            seen_groups.add(row.muscle_group)

    for row in ranked:
        if len(selected) >= target:
            break
        if row not in selected:
            selected.append(row)

    return RecommendationResult(exercises=selected, focus=FOCUS.get(user.goal, 'General fitness'))
