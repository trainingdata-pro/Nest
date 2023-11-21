from copy import copy

from apps.assessors.services import assessors_service
from apps.history.services import history
from .models import Project


def remove_assessors_from_project(project: Project, user: str, completed_project: bool = False) -> None:
    """
    Removes all assessors from the current project and,
    if necessary, removes inactive second managers from the assessor.
    Makes an entry in the assessor's history.
    :param project: Project object.
    :param user: A string indicating who made the update.
    :param completed_project: If True, then if the assessor object has deleted
    projects, the “completed_project” event will be selected.
    """
    managers = project.manager.all()
    assessors = project.assessors.all()
    if assessors:
        for instance in assessors:
            instance_before_update = copy(instance)
            projects_before_update = [pr.pk for pr in instance.projects.all()]
            instance.projects.remove(project)  # remove current project from assessor
            for manager in managers:
                if (not instance.projects.filter(manager__in=[manager]).exists()
                        and manager in instance.second_manager.all()):
                    instance.second_manager.remove(manager)  # remove inactive second manager

            assessors_service.check_and_update_state(instance)

            history.updated_assessor_history(
                old_assessor=instance_before_update,
                new_assessor=instance,
                user=user,
                old_projects=projects_before_update,
                completed_project=completed_project
            )
