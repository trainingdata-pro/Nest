from django.db.models import QuerySet
from rest_framework.exceptions import ValidationError

from apps.users.models import BaseUser
from apps.projects.models import Project


def is_team_lead(project: Project, manager: BaseUser) -> bool:
    return project.manager.filter(operational_manager=manager).exists()


def check_project_permission(projects: QuerySet[Project], manager: BaseUser) -> None:
    for project in projects:
        if manager not in project.manager.all() and not is_team_lead(project, manager):
            raise ValidationError(
                {'projects': f'Недостаточно прав, чтобы выбрать проект "{project.name}".'}
            )
