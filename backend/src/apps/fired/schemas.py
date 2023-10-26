from drf_yasg import openapi

from apps.assessors.serializers import AssessorSerializer
from apps.export.serializers import ExportSerializer
from apps.export.services import allowed_types
from core.schemas import BaseAPISchema

from . import serializers


class ReasonSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get fire reason',
            operation_description='Get a specific fire reason info.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique reason ID.'
                )
            ],
            responses={
                200: serializers.ReasonSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List fire reasons',
            operation_description='Get list of fire reasons.',
            manual_parameters=[
                openapi.Parameter(
                    name='title',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by reason title.'
                ),
                openapi.Parameter(
                    name='blacklist_reason',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_BOOLEAN,
                    description='Case-independent filtering by reason blacklist_reason value.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, title, blacklist_reason'
                )
            ],
            responses={**self.get_responses(401)}
        )


class FiredSchema(BaseAPISchema):
    def retrieve_blacklist(self):
        return self.swagger_auto_schema(
            operation_summary='Get assessor from blacklist',
            operation_description='Get a specific assessor info from blacklist.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
                )
            ],
            responses={
                200: serializers.BlackListSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list_blacklist(self):
        return self.swagger_auto_schema(
            operation_summary='All blacklist',
            operation_description='Get all assessors in blacklist.',
            manual_parameters=[
                openapi.Parameter(
                    name='name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor username or full name.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def retrieve_fired(self):
        return self.swagger_auto_schema(
            operation_summary='Get fired assessor',
            operation_description='Get a specific assessor info from fired.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique fired assessor ID.'
                )
            ],
            responses={
                200: serializers.FiredSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list_fired(self):
        return self.swagger_auto_schema(
            operation_summary='List fired assessors',
            operation_description='Get all assessors in fired.',
            manual_parameters=[
                openapi.Parameter(
                    name='name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor username or full name.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def back(self):
        return self.swagger_auto_schema(
            operation_summary='Return assessor to a team',
            operation_description='Return a specific assessor to a team.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique fired item ID.'
                )
            ],
            responses={
                200: AssessorSerializer(),
                **self.get_responses(400, 401, 404)
            }
        )


class ExportBlackListSchema(BaseAPISchema):
    def export(self):
        return self.swagger_auto_schema(
            operation_summary='Export blacklist',
            operation_description='Returns unique celery task ID.',
            manual_parameters=[
                openapi.Parameter(
                    name='type',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    required=True,
                    description=f'Output file type.\nAvailable types: {", ".join(allowed_types())}'
                ),
                openapi.Parameter(
                    name='items',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_INTEGER),
                    required=False,
                    description='List of item IDs in the blacklist.\n'
                                'If the list is empty, then all items will '
                                'be exported.\n'
                                'Example: host.com/?type=csv&item=1,2,3'
                )
            ],
            responses={
                202: ExportSerializer(),
                **self.get_responses(401)
            }
        )


reason_schema = ReasonSchema(tags=['fired'])
fired_schema = FiredSchema(tags=['fired'])
export_schema = ExportBlackListSchema(tags=['export'])
