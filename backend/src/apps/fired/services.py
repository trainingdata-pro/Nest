from datetime import datetime
from typing import Optional

from apps.assessors.models import Assessor, AssessorState
from apps.fired.models import Fired, BlackList
from core.mixins import BaseService


class FiredService(BaseService):
    model = Fired

    def fire(self, assessor: Assessor, reason: str, possible_return_date: Optional[datetime.date] = None) -> Fired:
        fired = self.create_instance(
            assessor=assessor,
            reason=reason,
            possible_return_date=possible_return_date
        )
        return self.perform_save(fired)


class BlackListService(BaseService):
    model = BlackList

    def blacklist(self, assessor: Assessor, reason: str) -> BlackList:
        blacklist = self.create_instance(
            assessor=assessor,
            reason=reason
        )
        return self.perform_save(blacklist)

    def remove_item(self, instance: BlackList) -> None:
        return self.perform_delete(instance)


fired_service = FiredService()
blacklist_service = BlackListService()
