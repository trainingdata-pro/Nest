import datetime
from typing import List, Tuple, Any, Dict, Iterable

from django.db.models import QuerySet

from apps.export import services
from core.utils import get_code, current_date
from apps.projects.models import Project, ProjectStatuses


class ProjectExport:
    TYPES: Dict = {
        services.CSV_TYPE: services.CSVWriter,
        services.EXCEL_TYPE: services.ExcelWriter
    }
    model = Project

    def __init__(self, export_type: str):
        self.export_type = export_type

    def export(self, team: Iterable[int]):
        writer = self._get_writer(self.export_type)
        projects = self._get_projects(team)
        data = self._parse(projects)
        filename = self._generate_filename()
        path_to_file = writer.write(data=data, filename=filename)
        return path_to_file

    def _get_projects(self, team: Iterable[int]) -> QuerySet[Project]:
        return self.model.objects.filter(
            status=ProjectStatuses.COMPLETED,
            manager__in=team
        ).prefetch_related('manager', 'tag')

    def _get_headers(self) -> List[str]:
        headers = [field.verbose_name for field in self.model._meta.fields]
        headers.insert(3, 'менеджеры')
        headers.insert(10, 'тег')
        return headers

    def _parse(self, queryset: QuerySet[Project]) -> List[List[Any]]:
        data = [self._get_headers()]
        for project in queryset:
            managers_str = self._m2m_to_str(
                project.manager.values_list('last_name', 'first_name', 'middle_name')
            )
            tags_str = self._m2m_to_str(project.tag.values_list('name'))
            date_of_creation = self._date_to_str(project.date_of_creation) if project.date_of_creation else None
            date_of_completion = self._date_to_str(project.date_of_completion) if project.date_of_completion else None
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

    def _get_writer(self, export_type: str) -> services.Writer:
        return self.TYPES[export_type]()

    def _generate_filename(self) -> str:
        h = get_code()[:5]
        date = self._date_to_str(current_date())
        return f'projects_{date}_{h}'

    @staticmethod
    def _m2m_to_str(values: QuerySet[Tuple[Any]]) -> str:
        parts = [' '.join(value) for value in values]
        return '; '.join(parts)

    @staticmethod
    def _date_to_str(date: datetime.date) -> str:
        return date.strftime('%d-%m-%Y')
