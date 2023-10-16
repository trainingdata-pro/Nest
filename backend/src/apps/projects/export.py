from typing import List, Any, Dict

from django.db.models import QuerySet

from apps.assessors.models import Assessor, AssessorState
from apps.export import services
from core.export import BaseExportService
from .models import Project, ProjectStatuses


class ProjectExport(BaseExportService):
    TYPES: Dict = {
        services.CSV_TYPE: services.CSVWriter,
        services.EXCEL_TYPE: services.ExcelWriter
    }
    model = Project
    file_prefix = 'projects'

    def export(self, team: List[int]) -> str:
        writer = self.get_writer()
        values = self.get_values(team)
        data = self.parse(values)
        filename = self.generate_filename()
        path_to_file = writer.write(data=data, filename=filename)
        return path_to_file

    def get_values(self, team: List[int]) -> QuerySet[Project]:
        return self.model.objects.filter(
            status=ProjectStatuses.COMPLETED,
            manager__in=team
        ).prefetch_related('manager', 'tag')

    def get_headers(self) -> List[str]:
        headers = super().get_headers()
        headers.insert(3, 'менеджеры')
        headers.insert(10, 'тег')
        return headers

    def parse(self, queryset: QuerySet[Project]) -> List[List[Any]]:
        data = [self.get_headers()]
        for project in queryset:
            managers_str = self.m2m_to_str(
                project.manager.values_list('last_name', 'first_name', 'middle_name')
            )
            tags_str = self.m2m_to_str(project.tag.values_list('name'))
            date_of_creation = self.date_to_str(project.date_of_creation) if project.date_of_creation else None
            date_of_completion = self.date_to_str(project.date_of_completion) if project.date_of_completion else None
            status = ProjectStatuses.get_value(project.status)
            item = [
                project.id,
                project.asana_id,
                project.name,
                managers_str,
                project.speed_per_hour,
                project.price_for_assessor,
                project.price_for_costumer,
                project.unloading_value,
                project.unloading_regularity,
                status,
                tags_str,
                date_of_creation,
                date_of_completion
            ]
            data.append(item)

        return data


class AssessorsForProjectExport(BaseExportService):
    TYPES: Dict = {
        services.CSV_TYPE: services.CSVWriter,
        services.EXCEL_TYPE: services.ExcelWriter
    }
    model = Assessor
    file_prefix = 'assessors'

    def export(self, project_id: int) -> str:
        writer = self.get_writer()
        values = self.get_values(project_id)
        data = self.parse(values)
        filename = self.generate_filename()
        path_to_file = writer.write(data=data, filename=filename)
        return path_to_file

    def get_values(self, project_id: int) -> QuerySet[Assessor]:
        project = Project.objects.filter(id=project_id)
        if project.exists():
            return (self.model.objects
                    .filter(projects__in=[project.first()])
                    .select_related('manager')
                    .prefetch_related('skills', 'second_manager'))
        return Assessor.objects.none()

    def get_headers(self) -> List[str]:
        headers = super().get_headers()
        headers.insert(8, 'навыки')
        headers.insert(14, 'доп. менеджеры')
        return headers

    def parse(self, queryset: QuerySet[Assessor]) -> List[List[Any]]:
        data = [self.get_headers()]
        for assessor in queryset:
            skills_str = self.m2m_to_str(
                assessor.skills.values_list('title')
            )
            second_managers = assessor.second_manager.all()
            second_managers_str = self.second_managers_to_str(
                [obj.full_name for obj in second_managers]
            )
            item = [
                assessor.id,
                assessor.username,
                assessor.last_name,
                assessor.first_name,
                assessor.middle_name,
                assessor.email,
                assessor.country,
                assessor.manager.full_name,
                skills_str,
                AssessorState.get_value(assessor.state),
                assessor.date_of_registration,
                assessor.vacation_date,
                assessor.free_resource_weekday_hours,
                assessor.free_resource_day_off_hours,
                second_managers_str
            ]
            data.append(item)

        return data

    @staticmethod
    def second_managers_to_str(values: List[str]) -> str:
        return '; '.join(values)
