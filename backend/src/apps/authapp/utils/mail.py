from uuid import UUID

from django.conf import settings
from django.core.mail import send_mail


def _send_mail(subject: str, message: str, email: str) -> None:
    send_mail(
        subject=subject,
        message=message,
        from_email=None,
        recipient_list=[email]
    )


def send_user_confirmation_code(email: str, code: str) -> None:
    """ Send a confirmation code to the user """
    subject = 'Активация аккаунта'
    message = f'Для активации аккаунта, пожалуйста, перейдите по следующий ссылке:\n' \
              f'{settings.UI_URL}/signup/confirmation/{code}'
    _send_mail(subject, message, email)


def send_reset_password_token(email: str, token: UUID) -> None:
    subject = 'Сброс пароля'
    message = 'Для сброса пароля, пожалуйста, перейдите по следующей ссылке:\n' \
              f'{settings.UI_URL}/password/reset/{token}'
    _send_mail(subject, message, email)
