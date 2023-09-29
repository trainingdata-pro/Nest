from django.db.models import QuerySet

from ..models import Project, ProjectStatuses


class ProjectService:
    model = Project

    @property
    def completed(self) -> QuerySet[Project]:
        return self.model.objects.filter(status=ProjectStatuses.COMPLETED)


project_service = ProjectService()
