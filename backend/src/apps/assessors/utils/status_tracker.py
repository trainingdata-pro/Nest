from core.utils.common import current_date
from ..models import Assessor, AssessorState


def check_assessors_on_vacation() -> None:
    date = current_date()
    (Assessor.objects
     .filter(state=AssessorState.VACATION, vacation_date__lte=date)
     .update(state=AssessorState.WORK, vacation_date=None))
