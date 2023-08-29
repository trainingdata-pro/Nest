from drf_yasg import openapi

from core.utils.schemas import BaseAPISchema
from .models import HistoryEvents


class HistorySchema(BaseAPISchema):
    def get(self):
        return self.swagger_auto_schema(
            operation_summary='Get history',
            operation_description='Get a specific assessor history',
            manual_parameters=[
                openapi.Parameter(
                    name='assessor',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_QUERY,
                    required=True,
                    description='Unique assessor ID'
                ),
                openapi.Parameter(
                    name='event',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by event. Example: host.com/?event=created.\n\n'
                                f'Available events: '
                                f'{", ".join([f"{item[0]} - {item[1]}" for item in HistoryEvents.choices])}'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: event, timestamp.\n\n'
                                'Examples:\n'
                                'host.com/?ordering=-timestamp\n'
                                'host.com/?ordering=event'
                )
            ],
            responses={**self.get_responses(401)}
        )


history_schema = HistorySchema(tags=['history'])
