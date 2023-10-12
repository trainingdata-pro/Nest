import datetime
import os
from typing import List, Tuple, Any, Dict

from django.conf import settings
from django.db.models import QuerySet, Model

from core.utils import get_hash, current_date


class BaseWriterService:
    FORMAT: str

    def write(self, data: List[List[Any]], filename: str) -> str:
        raise NotImplementedError('`write()` must be implemented.')

    def get_path_to_save(self, filename: str) -> str:
        return os.path.join(settings.MEDIA_ROOT, f'{filename}.{self.FORMAT}')

    @staticmethod
    def get_full_filename(path_to_file: str) -> str:
        return os.path.basename(path_to_file)


class BaseExportService:
    TYPES: Dict
    model: Model
    file_prefix: str

    def __init__(self, export_type: str, *args, **kwargs):
        self.export_type = export_type

    def export(self, *args, **kwargs) -> str:
        raise NotImplementedError('`export()` must be implemented.')

    def get_values(self, *args, **kwargs) -> QuerySet:
        raise NotImplementedError('`get_values()` must be implemented.')

    def parse(self, queryset: QuerySet) -> List[List[Any]]:
        raise NotImplementedError('`parse()` must be implemented.')

    def get_headers(self) -> List[str]:
        headers = [field.verbose_name for field in self.model._meta.fields]
        return headers

    def get_writer(self) -> BaseWriterService:
        return self.TYPES[self.export_type]()

    def generate_filename(self) -> str:
        h = get_hash()[:5]
        date = self.date_to_str(current_date())
        return f'{self.file_prefix}_{date}_{h}'

    @staticmethod
    def m2m_to_str(values: QuerySet[Tuple[Any]]) -> str:
        parts = [' '.join(value) for value in values]
        return '; '.join(parts)

    @staticmethod
    def date_to_str(date: datetime.date) -> str:
        return date.strftime('%d-%m-%Y')
