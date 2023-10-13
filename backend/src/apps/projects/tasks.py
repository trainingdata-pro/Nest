from typing import List

from config.celery import app
from .export import ProjectExport


@app.task
def make_report(export_type: str, team: List[int]) -> str:
    exporter = ProjectExport(export_type)
    filename = exporter.export(team)
    return filename
