
from django.db.models import QuerySet
from rest_framework.exceptions import ValidationError

from users.models import Manager
from projects.models import Project
from .models import Assessor, AssessorStatus


def is_team_lead(project: Project, manager: Manager) -> bool:
    return project.manager.filter(operational_manager=manager).exists()


def check_project_permission(projects: QuerySet, manager: Manager) -> None:
    for project in projects:
        if manager not in project.manager.all() and not is_team_lead(project, manager):
            raise ValidationError(
                {'projects': f'Недостаточно прав, чтобы выбрать проект "{project.name}".'}
            )


def remove_assessor(assessor: Assessor, state: str) -> Assessor:
    assessor.state = state
    assessor.manager = None
    assessor.projects = None
    assessor.status = AssessorStatus.FREE
    assessor.is_free_resource = False
    assessor.free_resource_weekday_hours = None
    assessor.free_resource_day_off_hours = None
    assessor.second_manager = None

    return assessor
