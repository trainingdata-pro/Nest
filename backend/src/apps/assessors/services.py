import datetime
from typing import Any, List, Optional, Union

from apps.projects.models import Project
from apps.users.models import BaseUser
from apps.assessors.models import Assessor, AssessorState


class AssessorService:
    model = Assessor

    def create_assessor(self, **data) -> Assessor:
        instance = self.__create_instance(**data)
        return self.__perform_save(instance)

    def check_and_update_state(self, instance: Assessor) -> Assessor:
        instance = self.__check_and_update_state(instance)
        return self.__perform_save(instance)

    def add_second_manager(self,
                           instance: Assessor,
                           manager: BaseUser,
                           project: Project) -> Assessor:
        if manager not in instance.second_manager.all():
            instance = self.__add_m2m(
                instance,
                attribute='second_manager',
                values=manager
            )
        instance = self.__add_m2m(
            instance,
            attribute='projects',
            values=project
        )
        instance.state = AssessorState.BUSY
        instance.free_resource_weekday_hours = None
        instance.free_resource_day_off_hours = None
        return self.__perform_save(instance)

    def check_and_remove_second_managers(self, instance: Assessor, manager: BaseUser) -> Assessor:
        if (manager in instance.second_manager.all()
                and not instance.projects.filter(manager=manager).exists()):
            self.__remove_second_manager_m2m(instance, manager)

        return instance

    def to_vacation(self, instance: Assessor, vacation_date: datetime.date) -> Assessor:
        instance = self.__to_vacation(instance, vacation_date)
        return self.__perform_save(instance)

    def from_vacation(self, instance: Assessor) -> Assessor:
        instance = self.__from_vacation(instance)
        return self.__perform_save(instance)

    def to_free_resources(self,
                          instance: Assessor,
                          weekday_hours: datetime.date,
                          day_off_hours: datetime.date) -> Assessor:
        instance = self.__to_free_resource(instance, weekday_hours, day_off_hours)
        return self.__perform_save(instance)

    def from_free_resources(self, instance: Assessor) -> Assessor:
        instance = self.__from_free_resources(instance)
        return self.__perform_save(instance)

    def unpin(self, instance: Assessor) -> Assessor:
        instance = self.__unpin(instance)
        return self.__perform_save(instance)

    def to_new_team(self, instance: Assessor, manager: BaseUser, state: Optional[str] = None) -> Assessor:
        instance = self.__to_new_team(instance, manager, state)
        return self.__perform_save(instance)

    def fire(self, instance: Assessor) -> Assessor:
        instance.manager = None
        instance.status = None
        return self.__perform_save(instance)

    def __create_instance(self, **kwargs) -> Assessor:
        return self.model(**kwargs)

    @staticmethod
    def __perform_save(instance: Assessor) -> Assessor:
        instance.save()
        return instance

    @staticmethod
    def __set_m2m(instance: Assessor, attribute: str, values: List[Any]) -> Assessor:
        attr = getattr(instance, attribute)
        if attr:
            attr.set(values)

        return instance

    @staticmethod
    def __add_m2m(instance: Assessor, attribute: str, values: Union[List[Any], Any], many=False) -> Assessor:
        attr = getattr(instance, attribute)
        if attr:
            if many:
                for value in values:
                    attr.add(value)
            else:
                attr.add(values)

        return instance

    @staticmethod
    def __check_and_update_state(instance: Assessor) -> Assessor:
        if instance.state != AssessorState.FREE_RESOURCE:
            if instance.projects.exists():
                instance.state = AssessorState.BUSY
            else:
                instance.state = AssessorState.AVAILABLE

        return instance

    @staticmethod
    def __remove_second_manager_m2m(instance: Assessor, manager: BaseUser) -> Assessor:
        instance.second_manager.remove(manager)
        return instance

    @staticmethod
    def __to_vacation(instance: Assessor, vacation_date: datetime.date) -> Assessor:
        instance.state = AssessorState.VACATION
        instance.vacation_date = vacation_date
        return instance

    @staticmethod
    def __from_vacation(instance: Assessor) -> Assessor:
        instance.state = AssessorState.AVAILABLE
        instance.vacation_date = None
        return instance

    @staticmethod
    def __to_free_resource(instance: Assessor,
                           weekday_hours: datetime.date,
                           day_off_hours: datetime.date) -> Assessor:
        instance.state = AssessorState.FREE_RESOURCE
        instance.free_resource_weekday_hours = weekday_hours
        instance.free_resource_day_off_hours = day_off_hours
        return instance

    @staticmethod
    def __from_free_resources(instance: Assessor) -> Assessor:
        instance.free_resource_weekday_hours = None
        instance.free_resource_day_off_hours = None
        if instance.projects.exists():
            instance.state = AssessorState.BUSY
        else:
            instance.state = AssessorState.AVAILABLE

        return instance

    @staticmethod
    def __unpin(instance: Assessor) -> Assessor:
        instance.manager = None
        instance.state = AssessorState.FREE_RESOURCE
        instance.status = None
        return instance

    @staticmethod
    def __to_new_team(instance: Assessor, manager: BaseUser, state: Optional[str] = None) -> Assessor:
        instance.manager = manager
        if state is not None:
            instance.state = state
        else:
            if instance.projects.exists():
                instance.state = AssessorState.BUSY
            else:
                instance.state = AssessorState.AVAILABLE

        return instance


assessors_service = AssessorService()
