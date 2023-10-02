import csv
import datetime
import os.path
from abc import ABC, abstractmethod
from typing import List, Tuple, Any, Dict, Iterable

from django.conf import settings
from django.db.models import QuerySet
import pandas
from rest_framework.exceptions import ValidationError

from core.utils.common import get_code, current_date
from ..models import Project, ProjectStatuses

CSV_TYPE = 'csv'
EXCEL_TYPE = 'xlsx'


def allowed_types() -> List[str]:
    return [CSV_TYPE, EXCEL_TYPE]


class ContentType:
    CSV: str = 'text/csv'
    EXCEL: str = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    @classmethod
    def validate(cls, export_type: str) -> None:
        if export_type.lower() not in allowed_types():
            raise ValidationError({'type': ['Invalid export type.']})

    @classmethod
    def get_content_type(cls, filename: str) -> str:
        ext = filename.split('.')[-1]
        if ext == CSV_TYPE:
            return cls.CSV
        elif ext == EXCEL_TYPE:
            return cls.EXCEL
        return ''


class Writer(ABC):
    FORMAT: str

    @abstractmethod
    def write(self, data: List[List[Any]], filename: str) -> str:
        pass

    def get_path_to_save(self, filename: str) -> str:
        return os.path.join(settings.MEDIA_ROOT, f'{filename}.{self.FORMAT}')

    @staticmethod
    def get_full_filename(path_to_file: str) -> str:
        return os.path.basename(path_to_file)


class CSVWriter(Writer):
    FORMAT = CSV_TYPE

    def write(self, data: List[List[Any]], filename: str) -> str:
        path_to_save = self.get_path_to_save(filename)
        with open(path_to_save, 'w') as file:
            writer = csv.writer(file)
            writer.writerows(data)
        return self.get_full_filename(path_to_save)


class ExcelWriter(Writer):
    FORMAT = EXCEL_TYPE

    def write(self, data: List[List[Any]], filename: str) -> str:
        path_to_save = self.get_path_to_save(filename)
        df = pandas.DataFrame(data[1:], columns=data[0])
        df.to_excel(path_to_save, index=False)
        return self.get_full_filename(path_to_save)


class ProjectExport:
    TYPES: Dict = {
        CSV_TYPE: CSVWriter,
        EXCEL_TYPE: ExcelWriter
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

    def _get_writer(self, export_type: str) -> Writer:
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
