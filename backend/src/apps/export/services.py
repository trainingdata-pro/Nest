import csv
from typing import List, Any

import pandas
from rest_framework.exceptions import ValidationError

from core.export import BaseWriterService

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


class CSVWriter(BaseWriterService):
    FORMAT = CSV_TYPE

    def write(self, data: List[List[Any]], filename: str) -> str:
        path_to_save = self.get_path_to_save(filename)
        with open(path_to_save, 'w') as file:
            writer = csv.writer(file)
            writer.writerows(data)
        return self.get_full_filename(path_to_save)


class ExcelWriter(BaseWriterService):
    FORMAT = EXCEL_TYPE

    def write(self, data: List[List[Any]], filename: str) -> str:
        path_to_save = self.get_path_to_save(filename)
        df = pandas.DataFrame(data[1:], columns=data[0])
        df.to_excel(path_to_save, index=False)
        return self.get_full_filename(path_to_save)
