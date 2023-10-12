from datetime import datetime
from typing import Optional

from apps.assessors.models import Assessor, AssessorState
from apps.fired.models import Fired, BlackList


class FiredService:
    model = Fired

    def fire(self, assessor: Assessor, reason: str, possible_return_date: Optional[datetime.date] = None) -> Fired:
        fired = self.__create_instance(
            assessor=assessor,
            reason=reason,
            possible_return_date=possible_return_date
        )
        assessor.state = AssessorState.FIRED
        return self.__perform_save(fired)

    def __create_instance(self, **kwargs) -> Fired:
        return self.model(**kwargs)

    @staticmethod
    def __perform_save(instance: Fired) -> Fired:
        instance.save()
        return instance


class BlackListService:
    model = BlackList

    def blacklist(self, assessor: Assessor, reason: str) -> BlackList:
        blacklist = self.__create_instance(
            assessor=assessor,
            reason=reason
        )
        assessor.state = AssessorState.BLACKLIST
        return self.__perform_save(blacklist)

    def remove_item(self, instance: BlackList) -> None:
        return self.__perform_delete(instance)

    def __create_instance(self, **kwargs) -> BlackList:
        return self.model(**kwargs)

    @staticmethod
    def __perform_save(instance: BlackList) -> BlackList:
        instance.save()
        return instance

    @staticmethod
    def __perform_delete(instance: BlackList) -> None:
        instance.delete()


fired_service = FiredService()
blacklist_service = BlackListService()
