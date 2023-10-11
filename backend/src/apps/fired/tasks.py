from typing import Optional

from celery import shared_task

from .export import BlackListExport


@shared_task
def make_report(export_type: str, items: Optional[str] = None) -> str:
    exporter = BlackListExport(export_type, items=items)
    filename = exporter.export()
    return filename
