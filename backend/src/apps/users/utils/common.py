import datetime
import hashlib
import time

from django.utils import timezone

from core.settings import RESET_PASSWORD_TOKEN_EXPIRATION_DAY


def get_code() -> str:
    """ Get 20 character long code """
    h = hashlib.sha512()
    h.update(str(time.time()).encode('utf-8'))
    return h.hexdigest()[:20]


def create_expiration_date():
    return timezone.now() + datetime.timedelta(days=RESET_PASSWORD_TOKEN_EXPIRATION_DAY)
