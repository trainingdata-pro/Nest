from drf_yasg import openapi

from core.schemas import BaseAPISchema
from apps.assessors.serializers import AssessorSerializer

from . import serializers


class ReasonSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get fire reason',
            operation_description='Get a specific fire reason',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique fire reason ID'
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
            operation_description='Get list of fire reasons',
            manual_parameters=[
                openapi.Parameter(
                    name='title',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by title'
                ),
                openapi.Parameter(
                    name='blacklist_reason',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_BOOLEAN,
                    description='Case-independent filtering by blacklist_reason value'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, title, blacklist_reason'
                )
            ],
            responses={**self.get_responses(401)}
        )


class FiredSchema(BaseAPISchema):
    def retrieve_blacklist(self):
        return self.swagger_auto_schema(
            operation_summary='Get assessor from blacklist',
            operation_description='Get a specific assessor from blacklist',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID'
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
            operation_description='Get all blacklist',
            responses={**self.get_responses(401)}
        )

    def retrieve_fired(self):
        return self.swagger_auto_schema(
            operation_summary='Get fired assessor',
            operation_description='Get a specific fired assessor',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique fired assessor ID'
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
            operation_description='Get list of fired assessors',
            responses={**self.get_responses(401)}
        )

    def back(self):
        return self.swagger_auto_schema(
            operation_summary='Return assessor to a team',
            operation_description='Return assessor to a team.\n',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique fired item ID'
                )
            ],
            responses={
                200: AssessorSerializer(),
                **self.get_responses(400, 401, 404)
            }
        )


reason_schema = ReasonSchema(tags=['fired'])
fired_schema = FiredSchema(tags=['fired'])
