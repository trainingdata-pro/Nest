from typing import Set

from django.db.models.base import ModelBase
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from apps.projects.models import Project
from .models import Assessor


@receiver(m2m_changed, sender=Assessor.projects.through)
def remove_project_related_objects(
        sender: ModelBase,
        instance: Assessor,
        action: str,
        reverse: bool,
        model: Project,
        pk_set: Set,
        **kwargs) -> None:
    """
    Remove project working hours and workload status objects
    when an assessor is removed from a project
    """
    if action == 'post_remove':
        if not reverse:
            instance.project_working_hours.filter(project_id__in=pk_set).delete()
            instance.workload_status.filter(project_id__in=pk_set).delete()
