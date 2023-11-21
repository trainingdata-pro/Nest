import datetime
from typing import Any, List, Optional, Union

from apps.projects.models import Project
from apps.users.models import BaseUser
from apps.assessors.models import Assessor, AssessorState
from core.mixins import BaseService


class AssessorService(BaseService):
    model = Assessor

    def create_assessor(self, **data) -> Assessor:
        """ Create a new assessor """
        instance = self.create_instance(**data)
        return self.perform_save(instance)

    def check_and_update_state(self, instance: Assessor) -> Assessor:
        """ Check assessor projects and update state """
        instance = self.__check_and_update_state(instance)
        return self.perform_save(instance)

    def add_second_manager(self,
                           instance: Assessor,
                           manager: BaseUser,
                           project: Project) -> Assessor:
        """ Add new second manager to assessor """

        # add second manager
        if manager not in instance.second_manager.all():
            instance = self.__add_m2m(
                instance,
                attribute='second_manager',
                values=manager
            )

        # add projects
        instance = self.__add_m2m(
            instance,
            attribute='projects',
            values=project
        )
        instance.state = AssessorState.BUSY
        instance.free_resource_weekday_hours = None
        instance.free_resource_day_off_hours = None
        return self.perform_save(instance)

    def check_and_remove_second_managers(self, instance: Assessor, manager: BaseUser) -> Assessor:
        """ Remove a second manager if assessor doesn't work on his projects """
        if (manager in instance.second_manager.all()
                and not instance.projects.filter(manager=manager).exists()):
            self.__remove_second_manager_m2m(instance, manager)

        return instance

    def to_vacation(self, instance: Assessor, vacation_date: datetime.date) -> Assessor:
        """ Send assessor to vacation """
        instance = self.__to_vacation(instance, vacation_date)
        return self.perform_save(instance)

    def from_vacation(self, instance: Assessor) -> Assessor:
        """ Return assessor from vacation """
        instance = self.__from_vacation(instance)
        return self.perform_save(instance)

    def to_free_resources(self,
                          instance: Assessor,
                          weekday_hours: datetime.date,
                          day_off_hours: datetime.date) -> Assessor:
        """ Send assessor to free resources """
        instance = self.__to_free_resource(instance, weekday_hours, day_off_hours)
        return self.perform_save(instance)

    def from_free_resources(self, instance: Assessor) -> Assessor:
        """ Return assessor from free resources """
        instance = self.__from_free_resources(instance)
        return self.perform_save(instance)

    def unpin(self, instance: Assessor) -> Assessor:
        """ Remove assessor from a team """
        instance = self.__unpin(instance)
        return self.perform_save(instance)

    def to_new_team(self, instance: Assessor, manager: BaseUser, state: Optional[str] = None) -> Assessor:
        """ Add assessor to a new team """
        instance = self.__to_new_team(instance, manager, state)
        return self.perform_save(instance)

    def fire(self, instance: Assessor, to_blacklist: bool = False) -> Assessor:
        """ Fire assessor """
        instance.manager = None
        instance.status = None
        instance.state = AssessorState.BLACKLIST if to_blacklist else AssessorState.FIRED
        return self.perform_save(instance)

    @staticmethod
    def __add_m2m(instance: Assessor, attribute: str, values: Union[List[Any], Any], many=False) -> Assessor:
        """
        Add new values to many-to-many fields.
        :param attribute: M2M field to update.
        :param values: New values to add.
        :param many: Use True when values param is a list
        """
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
        """ Update assessor state """
        if instance.state != AssessorState.FREE_RESOURCE:
            if instance.projects.exists():
                instance.state = AssessorState.BUSY
            else:
                instance.state = AssessorState.AVAILABLE

        return instance

    @staticmethod
    def __remove_second_manager_m2m(instance: Assessor, manager: BaseUser) -> Assessor:
        """ Remove a specific second manager from assessor """
        instance.second_manager.remove(manager)
        return instance

    @staticmethod
    def __to_vacation(instance: Assessor, vacation_date: datetime.date) -> Assessor:
        """ Change assessor state and set vacation date """
        instance.state = AssessorState.VACATION
        instance.vacation_date = vacation_date
        return instance

    @staticmethod
    def __from_vacation(instance: Assessor) -> Assessor:
        """ Change assessor state and remove vacation date """
        instance.state = AssessorState.AVAILABLE
        instance.vacation_date = None
        return instance

    @staticmethod
    def __to_free_resource(instance: Assessor,
                           weekday_hours: datetime.date,
                           day_off_hours: datetime.date) -> Assessor:
        """ Change assessor state and set hours for free resource """
        instance.state = AssessorState.FREE_RESOURCE
        instance.free_resource_weekday_hours = weekday_hours
        instance.free_resource_day_off_hours = day_off_hours
        return instance

    @staticmethod
    def __from_free_resources(instance: Assessor) -> Assessor:
        """ Change assessor state and remove hours for free resource """
        instance.free_resource_weekday_hours = None
        instance.free_resource_day_off_hours = None
        if instance.projects.exists():
            instance.state = AssessorState.BUSY
        else:
            instance.state = AssessorState.AVAILABLE

        return instance

    @staticmethod
    def __unpin(instance: Assessor) -> Assessor:
        """ Remove manager, change status and state """
        instance.manager = None
        instance.state = AssessorState.FREE_RESOURCE
        instance.status = None
        return instance

    def __to_new_team(self, instance: Assessor, manager: BaseUser, state: Optional[str] = None) -> Assessor:
        """ Set a new assessor manager and change state """
        instance.manager = manager
        if manager in instance.second_manager.all():
            self.__remove_second_manager_m2m(instance, manager)

        if state is not None:
            instance.state = state
        else:
            if instance.projects.exists():
                instance.state = AssessorState.BUSY
            else:
                instance.state = AssessorState.AVAILABLE

        return instance


assessors_service = AssessorService()
