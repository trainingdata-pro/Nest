from uuid import UUID

import django.utils.timezone
from django.conf import settings
from django.core.mail import send_mail

from config.celery import app
from .models import PasswordResetToken


@app.task
def send_confirmation_code(email: str, code: str) -> None:
    """ Send user confirmation code """
    subject = 'Активация аккаунта'
    message = f'Для активации аккаунта, пожалуйста, перейдите по следующий ссылке:\n' \
              f'{settings.MAIN_HOST}/signup/confirmation/{code}'
    send_mail(
        subject=subject,
        message=message,
        from_email=None,
        recipient_list=[email]
    )


@app.task
def reset_password(email: str, token: UUID) -> None:
    """ Send reset password link """
    subject = 'Сброс пароля'
    message = 'Для сброса пароля, пожалуйста, перейдите по следующей ссылке:\n' \
              f'{settings.MAIN_HOST}/password/reset/{token}'
    send_mail(
        subject=subject,
        message=message,
        from_email=None,
        recipient_list=[email]
    )


@app.task
def remove_old_tokens() -> None:
    """ Check and remove all old reset password tokens """
    date = django.utils.timezone.now() - django.utils.timezone.timedelta(days=7)
    PasswordResetToken.objects.filter(expiration_time__lt=date).delete()
