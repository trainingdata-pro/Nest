from typing import List

from config.celery import app
from .export import ProjectExport, AssessorsForProjectExport


@app.task
def make_report_projects(export_type: str, team: List[int]) -> str:
    exporter = ProjectExport(export_type)
    filename = exporter.export(team)
    return filename


@app.task
def make_report_assessors(export_type: str, project_id: int) -> str:
    exporter = AssessorsForProjectExport(export_type)
    filename = exporter.export(project_id)
    return filename
