from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.deps import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


def serialize_user(
    user: models.User,
) -> schemas.UserOut:
    equipment = []

    if isinstance(user.equipment, list):
        equipment = [
            str(item).strip()
            for item in user.equipment
            if str(item).strip()
        ]

    elif isinstance(user.equipment, str):
        equipment = [
            item.strip()
            for item in user.equipment.split(",")
            if item.strip()
        ]

    return schemas.UserOut(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        avatar_url=user.avatar_url,
        fitness_level=user.fitness_level,
        goal=user.goal,
        training_frequency=user.training_frequency,
        equipment=equipment,
        age=user.age,
        height_cm=user.height_cm,
        weight_kg=user.weight_kg,
        profile_completed=user.profile_completed,
        created_at=user.created_at,
    )


@router.post(
    "/register",
    response_model=schemas.TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(models.User)
        .filter(
            models.User.email
            == payload.email.lower()
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "An account with this email "
                "already exists."
            ),
        )

    user = models.User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        hashed_password=hash_password(
            payload.password,
        ),
        profile_completed=False,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        subject=user.id,
    )

    return schemas.TokenResponse(
        access_token=token,
        user=serialize_user(user),
    )


@router.post(
    "/login",
    response_model=schemas.TokenResponse,
)
def login(
    payload: schemas.UserLogin,
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(
            models.User.email
            == payload.email.lower()
        )
        .first()
    )

    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password.",
    )

    if not user or not verify_password(
        payload.password,
        user.hashed_password,
    ):
        raise invalid_credentials

    token = create_access_token(
        subject=user.id,
    )

    return schemas.TokenResponse(
        access_token=token,
        user=serialize_user(user),
    )


@router.get(
    "/me",
    response_model=schemas.UserOut,
)
def read_current_user(
    current_user: models.User = Depends(
        get_current_user,
    ),
):
    return serialize_user(current_user)


@router.put(
    "/me",
    response_model=schemas.UserOut,
)
def update_current_user(
    payload: schemas.UserUpdate,
    current_user: models.User = Depends(
        get_current_user,
    ),
    db: Session = Depends(get_db),
):
    update_data = payload.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(
            current_user,
            field,
            value,
        )

    db.commit()
    db.refresh(current_user)

    return serialize_user(current_user)


@router.put(
    "/change-password",
)
def change_password(
    payload: schemas.PasswordChange,
    current_user: models.User = Depends(
        get_current_user,
    ),
    db: Session = Depends(get_db),
):
    valid = verify_password(
        payload.current_password,
        current_user.hashed_password,
    )

    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    current_user.hashed_password = hash_password(
        payload.new_password,
    )

    db.commit()

    return {
        "detail": "Password updated successfully."
    }


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
)
def logout(
    current_user: models.User = Depends(
        get_current_user,
    ),
):
    return {
        "detail": "Logged out."
    }