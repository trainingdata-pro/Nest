import datetime

from django.utils import timezone

from core.settings import RESET_PASSWORD_TOKEN_EXPIRATION_DAY


def create_expiration_date():
    return timezone.now() + datetime.timedelta(days=RESET_PASSWORD_TOKEN_EXPIRATION_DAY)
