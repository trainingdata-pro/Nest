from typing import List, Any, Dict, Optional

from django.db.models import QuerySet

from apps.export import services
from core.export import BaseExportService
from .models import BlackList


class BlackListExport(BaseExportService):
    TYPES: Dict = {
        services.CSV_TYPE: services.CSVWriter,
        services.EXCEL_TYPE: services.ExcelWriter
    }
    model = BlackList
    file_prefix = 'blacklist'

    def __init__(self, export_type: str, items: Optional[str] = None):
        super().__init__(export_type)
        self.items = self._convert_str(items)

    def export(self) -> str:
        """
        Export data.
        Returns path to the data file
        """
        writer = self.get_writer()
        values = self.get_values()
        data = self.parse(values)
        filename = self.generate_filename()
        path_to_file = writer.write(data=data, filename=filename)
        return path_to_file

    def get_values(self) -> QuerySet[BlackList]:
        """
        Returns all blacklist objects
        if there aren't items to select,
        otherwise selected items
        """
        if not self.items:
            return self.model.objects.all().select_related('reason', 'assessor')
        else:
            return self.model.objects.filter(id__in=self.items).select_related('reason', 'assessor')

    def parse(self, queryset: QuerySet[BlackList]) -> List[List[Any]]:
        """ Parse objects and collect data for the report """
        data = [self.get_headers()]

        for value in queryset:
            data.append(
                [
                    value.id,
                    value.assessor.full_name,
                    value.date,
                    value.reason.title
                ]
            )

        return data

    @staticmethod
    def _convert_str(items: Optional[str] = None) -> List:
        """ Convert comma separated string to a list of IDs """
        if items is None:
            return []
        return [item for item in items.split(',') if item.isdigit()]
