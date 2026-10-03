from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])

PROFILE_FIELDS = (
    ("age", "age"),
    ("height_cm", "height"),
    ("weight_kg", "weight"),
    ("goal", "goal"),
    ("fitness_level", "fitness_level"),
    ("equipment", "equipment"),
    ("training_frequency", "training_frequency"),
)


def _completion(user: models.User) -> schemas.ProfileCompletionOut:
    missing = []
    completed = 0

    for field, label in PROFILE_FIELDS:
        value = getattr(user, field, None)
        present = bool(value) if field != "equipment" else bool(value)
        if present:
            completed += 1
        else:
            missing.append(label)

    total = len(PROFILE_FIELDS)
    completion = round((completed / total) * 100)

    # "None" is a valid equipment selection, so a non-empty list
    # containing "None" still counts as completed.
    is_complete = completed == total

    return schemas.ProfileCompletionOut(
        completion=completion,
        completed_fields=completed,
        total_fields=total,
        missing_fields=missing,
        profile_completed=is_complete,
    )


@router.get("", response_model=schemas.UserOut)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("/completion", response_model=schemas.ProfileCompletionOut)
def get_profile_completion(current_user: models.User = Depends(get_current_user)):
    return _completion(current_user)


@router.put("", response_model=schemas.UserOut)
def update_profile(
    payload: schemas.ProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = payload.model_dump(exclude_unset=True)

    # "None" is exclusive. Selecting it means the user has no equipment.
    if "equipment" in data and data["equipment"] is not None:
        equipment = [str(item).strip() for item in data["equipment"] if str(item).strip()]
        if "None" in equipment:
            equipment = ["None"]
        data["equipment"] = list(dict.fromkeys(equipment))

    effective_level = data.get("fitness_level", current_user.fitness_level)
    effective_equipment = data.get("equipment", current_user.equipment) or []
    if effective_level in {"Intermediate", "Advanced"} and "None" in effective_equipment:
        raise HTTPException(status_code=422, detail="Intermediate and Advanced training require equipment.")

    for field, value in data.items():
        setattr(current_user, field, value)

    completion = _completion(current_user)
    current_user.profile_completed = completion.profile_completed

    db.commit()
    db.refresh(current_user)

    return current_user
