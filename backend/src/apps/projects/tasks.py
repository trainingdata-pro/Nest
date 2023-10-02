import os
from datetime import datetime
from typing import Iterable

from celery import shared_task
from django.conf import settings

from core.utils.common import current_date
from .services.download_service import ProjectExport


@shared_task
def make_report(export_type: str, team: Iterable[int]) -> str:
    exporter = ProjectExport(export_type)
    filename = exporter.export(team)
    return filename


@shared_task
def remove_old_files():
    today = current_date()
    for file in os.listdir(settings.MEDIA_ROOT):
        path_to_file = os.path.join(settings.MEDIA_ROOT, file)
        creation_date = datetime.fromtimestamp(os.path.getctime(path_to_file)).date()
        delta = (today - creation_date).days
        if delta >= settings.FILE_STORAGE_DAYS:
            os.remove(path_to_file)
