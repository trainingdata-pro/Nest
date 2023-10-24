from drf_yasg import openapi

from core.schemas import BaseAPISchema
from .models import HistoryAction, HistoryAttribute


class HistorySchema(BaseAPISchema):
    def get(self):
        return self.swagger_auto_schema(
            operation_summary='Get history',
            operation_description='Get a specific assessor history info.',
            manual_parameters=[
                openapi.Parameter(
                    name='assessor',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_QUERY,
                    required=True,
                    description='Unique assessor ID.'
                ),
                openapi.Parameter(
                    name='action',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by action.\n'
                                'Example: host.com/?event=created.\n\n'
                                f'Available events:\n'
                                f'{", ".join([f"{item[0]} ({item[1]})" for item in HistoryAction.choices])}'
                ),
                openapi.Parameter(
                    name='attribute',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by attribute.\n'
                                'Example: host.com/?attribute=project.\n\n'
                                f'Available attributes:\n'
                                f'{", ".join([f"{item[0]} ({item[1]})" for item in HistoryAttribute.choices])}'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: action, attribute, timestamp.\n\n'
                                'Examples:\n'
                                'host.com/?ordering=-timestamp\n'
                                'host.com/?ordering=action'
                )
            ],
            responses={**self.get_responses(401)}
        )


history_schema = HistorySchema(tags=['history'])
