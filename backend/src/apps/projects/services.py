import datetime
from typing import List, Any, Optional

from apps.projects.models import (
    Project,
    ProjectTag,
    ProjectStatuses,
    ProjectWorkingHours,
    WorkLoadStatus
)
from apps.users.models import BaseUser
from core.mixins import BaseService
from core.utils import current_date


class ProjectService(BaseService):
    model = Project
    status = ProjectStatuses

    def create_project(self, **data) -> Project:
        """ Create a new project """
        instance = self.create_instance(**data)
        return self.perform_save(instance)

    def set_manager(self, instance: Project, managers: List[BaseUser]) -> Project:
        """ Set a project manager """
        return self.__set_m2m(instance, attribute='manager', values=managers)

    def set_tag(self, instance: Project, tag: List[ProjectTag]) -> Project:
        """ Set a project tag """
        return self.__set_m2m(instance, attribute='tag', values=tag)

    def is_completed(self, instance: Project) -> bool:
        """ Check if project is completed """
        return instance.status == self.status.COMPLETED

    def set_completion_date(self,
                            instance: Project,
                            date: Optional[datetime.date] = None,
                            set_null: bool = False) -> Project:
        """ Set a project completion date """
        if set_null:
            instance.date_of_completion = None
        else:
            if date is not None:
                instance.date_of_completion = date
            else:
                instance.date_of_completion = current_date()

        return self.perform_save(instance)

    def remove_related(self, instance: Project) -> None:
        """
        Remove all ProjectWorkingHours and WorkLoadStatus
        objects related with a specific project
        """
        return self.__remove_related(instance)

    def remove_assessors(self, instance: Project) -> Project:
        """ Remove all assessors for a specific project """
        return self.__remove_assessors(instance)

    @staticmethod
    def __set_m2m(instance: Project, attribute: str, values: List[Any]) -> Project:
        """
        Set new values to many-to-many fields.
        :param attribute: M2M field to update.
        :param values: List of new values to set.
        """
        attr = getattr(instance, attribute)
        if attr:
            attr.set(values)

        return instance

    @staticmethod
    def __remove_assessors(instance: Project) -> Project:
        instance.assessors.clear()
        return instance

    @staticmethod
    def __remove_related(instance: Project) -> None:
        ProjectWorkingHours.objects.filter(project=instance).delete()
        WorkLoadStatus.objects.filter(project=instance).delete()


project_service = ProjectService()
