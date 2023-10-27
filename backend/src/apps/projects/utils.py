from copy import copy

from apps.assessors.services import assessors_service
from apps.history.services import history
from .models import Project


def remove_assessors_from_project(project: Project, user: str, completed_project: bool = False) -> None:
    managers = project.manager.all()
    assessors = project.assessors.all()
    if assessors:
        for instance in assessors:
            instance_before_update = copy(instance)
            projects_before_update = [pr.pk for pr in instance.projects.all()]
            instance.projects.remove(project)
            for manager in managers:
                if (not instance.projects.filter(manager__in=[manager]).exists()
                        and manager in instance.second_manager.all()):
                    instance.second_manager.remove(manager)

            assessors_service.check_and_update_state(instance)

            history.updated_assessor_history(
                old_assessor=instance_before_update,
                new_assessor=instance,
                user=user,
                old_projects=projects_before_update,
                completed_project=completed_project
            )
