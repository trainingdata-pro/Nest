import hashlib
import time
from uuid import UUID

from django.core.mail import send_mail

from core.settings import UI_URL


def create_code() -> str:
    """ Get 20 character long code """
    h = hashlib.sha512()
    h.update(str(time.time()).encode('utf-8'))
    return h.hexdigest()[:20]


def _send_mail(subject: str, message: str, email: str) -> None:
    send_mail(
        subject=subject,
        message=message,
        from_email=None,
        recipient_list=[email]
    )


def _send_confirmation_code(email: str, code: str) -> None:
    """ Send a confirmation code to the user """
    subject = 'Активация аккаунта'
    message = f'Для активации аккаунта, пожалуйста, перейдите по следующий ссылке:\n' \
              f'{UI_URL}/signup/confirmation/{code}'
    _send_mail(subject, message, email)


def _send_reset_password_token(email: str, token: UUID) -> None:
    subject = 'Сброс пароля'
    message = 'Для сброса пароля, пожалуйста, перейдите по следующей ссылке:\n' \
              f'{UI_URL}/password/reset/{token}'
    _send_mail(subject, message, email)
