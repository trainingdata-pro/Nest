import os
from datetime import datetime

from celery import shared_task
from django.conf import settings

from core.utils import current_date


@shared_task
def remove_old_files():
    today = current_date()
    for file in os.listdir(settings.MEDIA_ROOT):
        path_to_file = os.path.join(settings.MEDIA_ROOT, file)
        creation_date = datetime.fromtimestamp(os.path.getctime(path_to_file)).date()
        delta = (today - creation_date).days
        if delta >= settings.FILE_STORAGE_DAYS:
            os.remove(path_to_file)