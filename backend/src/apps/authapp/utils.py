import datetime

from django.conf import settings
from django.utils import timezone


def create_expiration_date():
    """ Create reset password token expiration date """
    return timezone.now() + datetime.timedelta(days=settings.RESET_PASSWORD_TOKEN_EXPIRATION_DAY)
