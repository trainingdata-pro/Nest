import datetime
import hashlib
import time


def get_hash() -> str:
    """ Get 20 character long hash """
    h = hashlib.sha512()
    h.update(str(time.time()).encode('utf-8'))
    return h.hexdigest()[:20]


def current_date() -> datetime.date:
    """ Get current date """
    return datetime.datetime.now().date()
