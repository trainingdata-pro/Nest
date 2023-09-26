from typing import List

from django.db.models import QuerySet

from apps.history.models import History
from apps.history.services import history
from core.utils.common import current_date
from ..models import Assessor, AssessorState


def _get_assessors_for_update() -> QuerySet[Assessor]:
    date = current_date()
    return Assessor.objects.filter(state=AssessorState.VACATION, vacation_date__lte=date)


def _update_assessor_status(assessors_list: QuerySet[Assessor]) -> None:
    assessors_list.update(state=AssessorState.AVAILABLE, vacation_date=None)


def _get_new_vacation_history(assessors_list: QuerySet[Assessor]) -> List[History]:
    histories = []
    for assessor in assessors_list:
        pass
        # updates = history.vacation_event(assessor.manager, to_vacation=False)
        # history_obj = history.create_history_objects(assessor, updates)
        # histories.extend(history_obj)

    return histories


def check_assessors_on_vacation() -> None:
    assessors = _get_assessors_for_update()
    if assessors:
        histories = _get_new_vacation_history(assessors)
        _update_assessor_status(assessors)
        history.perform_create(histories)
