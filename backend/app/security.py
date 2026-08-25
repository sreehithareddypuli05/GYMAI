from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str | int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        # Keep existing local sessions valid after the JWT subject was changed
        # to the standards-compliant string form. Older GymAI tokens may have
        # an integer `sub`, so disable only python-jose's subject-type check and
        # normalize both legacy and current tokens to a string user id.
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
            options={"verify_sub": False},
        )
        subject = payload.get("sub")
        if isinstance(subject, (str, int)):
            return str(subject)
        return None
    except JWTError:
        return None
