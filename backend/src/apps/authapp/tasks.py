from uuid import UUID

from celery import shared_task

from .utils.mail import send_user_confirmation_code, send_reset_password_token


@shared_task
def send_confirmation_code(email: str, code: str) -> None:
    send_user_confirmation_code(email, code)


@shared_task
def reset_password(email: str, token: UUID) -> None:
    send_reset_password_token(email, token)
