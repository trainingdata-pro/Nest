import datetime
from typing import List, Any, Union, Optional

from apps.users.models import BaseUser
from core.utils.common import current_date
from ..models import (
    Project,
    ProjectTag,
    ProjectStatuses,
    ProjectWorkingHours,
    WorkLoadStatus
)


class ProjectService:
    model = Project
    status = ProjectStatuses

    def create_project(self, **data) -> Project:
        instance = self.__create_instance(**data)
        return self.__perform_save(instance)

    def set_manager(self, instance: Project, managers: List[BaseUser]) -> Project:
        return self.__set_m2m(instance, attribute='manager', values=managers)

    def set_tag(self, instance: Project, tag: List[ProjectTag]) -> Project:
        return self.__set_m2m(instance, attribute='tag', values=tag)

    def is_completed(self, instance: Project) -> bool:
        return instance.status == self.status.COMPLETED

    def set_completion_date(self,
                            instance: Project,
                            date: Optional[datetime.date] = None,
                            set_null: bool = False) -> Project:
        if set_null:
            instance.date_of_completion = None
        else:
            if date is not None:
                instance.date_of_completion = date
            else:
                instance.date_of_completion = current_date()

        return self.__perform_save(instance)

    def remove_related(self, instance: Project) -> None:
        return self.__remove_related(instance)

    def __create_instance(self, **kwargs) -> Project:
        instance = self.model(**kwargs)
        return instance

    @staticmethod
    def __perform_save(instance: Project) -> Project:
        instance.save()
        return instance

    @staticmethod
    def __set_m2m(instance: Project, attribute: str, values: List[Any]) -> Project:
        attr = getattr(instance, attribute)
        if attr:
            attr.set(values)

        return instance

    @staticmethod
    def __remove_related(instance: Project) -> None:
        ProjectWorkingHours.objects.filter(project=instance).delete()
        WorkLoadStatus.objects.filter(project=instance).delete()


project_service = ProjectService()
