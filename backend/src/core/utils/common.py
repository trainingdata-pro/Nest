import datetime


def current_date() -> datetime.date:
    return datetime.datetime.now().date()
