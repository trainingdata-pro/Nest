import os
from datetime import datetime

from django.conf import settings

from config.celery import app
from core.utils import current_date


@app.task
def remove_old_files():
    """ Check and remove old reports """
    today = current_date()
    for file in os.listdir(settings.MEDIA_ROOT):
        path_to_file = os.path.join(settings.MEDIA_ROOT, file)
        creation_date = datetime.fromtimestamp(os.path.getctime(path_to_file)).date()
        delta = (today - creation_date).days
        if delta >= settings.FILE_STORAGE_DAYS:
            os.remove(path_to_file)
