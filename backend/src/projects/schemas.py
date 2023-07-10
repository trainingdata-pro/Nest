from drf_yasg import openapi

from core.schemas import BaseAPISchema
from . import serializers


class ProjectSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get project',
            operation_description='Get a specific project',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project ID'
                )
            ],
            responses={
                200: serializers.ProjectSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List projects',
            operation_description='Get list of projects',
            manual_parameters=[
                openapi.Parameter(
                    name='name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by project name.'
                ),
                openapi.Parameter(
                    name='owner',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by owner ID.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: name, owner, date_of_create'
                )
            ],
            responses={
                200: serializers.ProjectSerializer(),
                **self.get_responses(401)
            }
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create project',
            operation_description='Create new project',
            responses={
                201: serializers.ProjectSerializer(),
                **self.get_responses(400, 401)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update project',
            operation_description='Update project',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project ID'
                )
            ],
            responses={
                200: serializers.ProjectSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def destroy(self):
        return self.swagger_auto_schema(
            operation_summary='Delete project',
            operation_description='Delete a specific project',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project ID'
                )
            ],
            responses={**self.get_responses(204, 401, 403, 404)}
        )


project_schema = ProjectSchema(tags=['projects'])
