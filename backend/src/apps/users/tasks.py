from uuid import UUID

from celery import shared_task

from .utils import _send_confirmation_code, _send_reset_password_token


@shared_task
def send_confirmation_code(email: str, code: str) -> None:
    _send_confirmation_code(email, code)


@shared_task
def send_reset_password_token(email: str, token: UUID) -> None:
    _send_reset_password_token(email, token)
