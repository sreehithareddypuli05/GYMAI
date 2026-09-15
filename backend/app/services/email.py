import smtplib
from email.message import EmailMessage

from app.config import settings


def send_password_reset_code(to_email: str, code: str) -> None:
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
        raise RuntimeError("SMTP email is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD.")

    sender = settings.smtp_from.strip() or settings.smtp_user.strip()

    message = EmailMessage()
    message["Subject"] = "GymAI password reset code"
    message["From"] = sender
    message["To"] = to_email
    message.set_content(
        f"""Hi,

We received a request to reset your GymAI password.

Your verification code is: {code}

This code expires in {settings.password_reset_expire_minutes} minutes. If you did not request a password reset, you can safely ignore this email.

— GymAI Security
"""
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
        if settings.smtp_use_tls:
            server.starttls()
        server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(message)
