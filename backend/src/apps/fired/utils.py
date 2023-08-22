from apps.assessors.models import Assessor, AssessorStatus


def remove_assessor(assessor: Assessor, state: str) -> Assessor:
    assessor.state = state
    assessor.manager = None
    assessor.projects.clear()
    assessor.status = AssessorStatus.FREE
    assessor.is_free_resource = False
    assessor.free_resource_weekday_hours = None
    assessor.free_resource_day_off_hours = None
    assessor.second_manager.clear()
    assessor.save()

    return assessor
