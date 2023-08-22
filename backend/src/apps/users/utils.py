import hashlib
import time

from django.core.mail import send_mail

from core.settings import UI_URL


# from core.settings import EMAIL_HOST_USER


def create_code() -> str:
    """ Get 20 character long code """
    h = hashlib.sha512()
    h.update(str(time.time()).encode('utf-8'))
    return h.hexdigest()[:20]


def send_code(email: str, code: str) -> None:
    """ Send a confirmation code to the user """
    subject = 'Активация аккаунта'
    message = f'Для активации аккаунта, пожалуйста, перейдите по следующий ссылке:\n' \
              f'{UI_URL}/signup/confirmation/{code}'
    send_mail(
        subject=subject,
        message=message,
        from_email=None,
        recipient_list=[email]
    )
