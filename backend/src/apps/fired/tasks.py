from typing import Optional

from config.celery import app
from .export import BlackListExport


@app.task
def make_report(export_type: str, items: Optional[str] = None) -> str:
    exporter = BlackListExport(export_type, items=items)
    filename = exporter.export()
    return filename
