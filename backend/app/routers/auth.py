from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import hashlib
import secrets
import smtplib
from email.message import EmailMessage

from app.config import settings

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



def _hash_reset_code(code: str) -> str:
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def _send_reset_email(email: str, code: str) -> None:
    if not settings.smtp_username or not settings.smtp_password or not settings.smtp_from_email:
        raise HTTPException(status_code=503, detail="Email service is not configured. Set SMTP_USERNAME, SMTP_PASSWORD and SMTP_FROM_EMAIL in backend/.env.")

    message = EmailMessage()
    message["Subject"] = "Your GymAI password reset code"
    message["From"] = settings.smtp_from_email
    message["To"] = email
    message.set_content(
        f"Your GymAI password reset code is {code}.\n\n"
        f"This code expires in {settings.reset_code_expire_minutes} minutes. "
        "If you did not request a password reset, you can ignore this email."
    )
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Could not send the reset email. Check your SMTP settings.") from exc


@router.post("/forgot-password")
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = str(payload.email).strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    # Invalidate previous codes for this user.
    if user:
        db.query(models.PasswordResetCode).filter(
            models.PasswordResetCode.user_id == user.id,
            models.PasswordResetCode.used.is_(False),
        ).update({"used": True}, synchronize_session=False)
        code = f"{secrets.randbelow(1_000_000):06d}"
        reset = models.PasswordResetCode(
            user_id=user.id,
            code_hash=_hash_reset_code(code),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.reset_code_expire_minutes),
            attempts=0,
            used=False,
        )
        db.add(reset)
        db.commit()
        try:
            _send_reset_email(email, code)
        except HTTPException:
            db.delete(reset)
            db.commit()
            raise

    return {"detail": "If an account exists for that email, a verification code has been sent."}


@router.post("/reset-password")
def reset_password(payload: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    email = str(payload.email).strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")

    reset = db.query(models.PasswordResetCode).filter(
        models.PasswordResetCode.user_id == user.id,
        models.PasswordResetCode.used.is_(False),
    ).order_by(models.PasswordResetCode.created_at.desc()).first()
    if not reset:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")

    now = datetime.now(timezone.utc)
    expires = reset.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < now or reset.attempts >= 5:
        reset.used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")

    if not secrets.compare_digest(reset.code_hash, _hash_reset_code(payload.code)):
        reset.attempts += 1
        if reset.attempts >= 5:
            reset.used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid verification code.")

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