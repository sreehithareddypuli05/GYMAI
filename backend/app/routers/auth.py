import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.deps import get_current_user
from app.config import settings
from app.services.email import send_password_reset_code


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
        working_days=user.working_days if isinstance(user.working_days, list) else None,
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
    email = str(payload.email).strip().lower()
    full_name = payload.full_name.strip()

    if len(full_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please enter your full name.",
        )

    existing = (
        db.query(models.User)
        .filter(models.User.email == email)
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
        full_name=full_name,
        email=email,
        hashed_password=hash_password(
            payload.password,
        ),
        profile_completed=False,
    )

    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    token = create_access_token(
        subject=str(user.id),
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
            == str(payload.email).strip().lower()
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
        subject=str(user.id),
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


@router.post("/forgot-password")
def forgot_password(
    payload: schemas.ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    email = str(payload.email).strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registered GymAI account was found for this email.",
        )

    # Prevent rapid repeated sends for the same account.
    latest = (
        db.query(models.PasswordResetCode)
        .filter(models.PasswordResetCode.user_id == user.id)
        .order_by(models.PasswordResetCode.created_at.desc())
        .first()
    )
    if latest and (datetime.now(timezone.utc) - latest.created_at.replace(tzinfo=timezone.utc)).total_seconds() < settings.password_reset_resend_seconds:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Please wait {settings.password_reset_resend_seconds} seconds before requesting another code.",
        )

    code = f"{secrets.randbelow(1_000_000):06d}"
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()

    reset = models.PasswordResetCode(
        user_id=user.id,
        code_hash=code_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.password_reset_expire_minutes),
        attempts=0,
        used=False,
    )
    db.add(reset)
    try:
        send_password_reset_code(user.email, code)
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="We could not send the verification email. Please try again later.",
        ) from exc

    db.commit()
    return {"detail": "A verification code was sent to your registered email."}


@router.post("/verify-reset-code")
def verify_reset_code(
    payload: schemas.PasswordResetVerification,
    db: Session = Depends(get_db),
):
    email = str(payload.email).strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification code.")

    reset = (
        db.query(models.PasswordResetCode)
        .filter(
            models.PasswordResetCode.user_id == user.id,
            models.PasswordResetCode.used == False,
        )
        .order_by(models.PasswordResetCode.created_at.desc())
        .first()
    )

    if not reset:
        raise HTTPException(status_code=400, detail="No active verification code. Request a new one.")

    now = datetime.now(timezone.utc)
    expires = reset.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < now:
        raise HTTPException(status_code=400, detail="This verification code has expired. Request a new one.")

    if reset.attempts >= 5:
        reset.used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Too many incorrect attempts. Request a new code.")

    supplied_hash = hashlib.sha256(payload.code.encode("utf-8")).hexdigest()
    if not secrets.compare_digest(supplied_hash, reset.code_hash):
        reset.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="Incorrect verification code.")

    return {"detail": "Verification code confirmed."}


@router.post("/reset-password")
def reset_password(
    payload: schemas.VerifyResetCode,
    db: Session = Depends(get_db),
):
    email = str(payload.email).strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification code.")

    reset = (
        db.query(models.PasswordResetCode)
        .filter(
            models.PasswordResetCode.user_id == user.id,
            models.PasswordResetCode.used == False,
        )
        .order_by(models.PasswordResetCode.created_at.desc())
        .first()
    )

    if not reset:
        raise HTTPException(status_code=400, detail="No active verification code. Request a new one.")

    now = datetime.now(timezone.utc)
    expires = reset.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < now:
        raise HTTPException(status_code=400, detail="This verification code has expired. Request a new one.")

    if reset.attempts >= 5:
        reset.used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Too many incorrect attempts. Request a new code.")

    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirmation do not match.")

    supplied_hash = hashlib.sha256(payload.code.encode("utf-8")).hexdigest()
    if not secrets.compare_digest(supplied_hash, reset.code_hash):
        reset.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="Incorrect verification code.")

    user.hashed_password = hash_password(payload.new_password)
    reset.used = True
    db.commit()

    return {"detail": "Password reset successfully. You can now log in."}


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