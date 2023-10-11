from typing import Iterable

from celery import shared_task

from .services.download_service import ProjectExport


@shared_task
def make_report(export_type: str, team: Iterable[int]) -> str:
    exporter = ProjectExport(export_type)
    filename = exporter.export(team)
    return filename



