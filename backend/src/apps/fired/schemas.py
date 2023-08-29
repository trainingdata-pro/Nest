from drf_yasg import openapi

from core.utils.schemas import BaseAPISchema
from apps.assessors.serializers import AssessorSerializer

from . import serializers


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

    def retrieve_bl_reason(self):
        return self.swagger_auto_schema(
            operation_summary='Get blacklist reason',
            operation_description='Get a specific blacklist reason',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique blacklist reason ID'
                )
            ],
            responses={
                200: serializers.BlackListReasonSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list_bl_reason(self):
        return self.swagger_auto_schema(
            operation_summary='List blacklist reasons',
            operation_description='Get list of blacklist reasons',
            responses={**self.get_responses(401)}
        )

    def retrieve_fired_reason(self):
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
                200: serializers.FiredReasonSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list_fired_reason(self):
        return self.swagger_auto_schema(
            operation_summary='List fire reasons',
            operation_description='Get list of fire reasons',
            responses={**self.get_responses(401)}
        )

    def back(self):
        return self.swagger_auto_schema(
            operation_summary='Return assessor to a team',
            operation_description='Return assessor to a team.\n'
                                  'The "manager" field is required for operational managers. '
                                  'Otherwise, the user who made the request will be assigned '
                                  'as the responsible manager.',
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


fired_schema = FiredSchema(tags=['fired'])
