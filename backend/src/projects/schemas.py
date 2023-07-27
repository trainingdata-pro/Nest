from drf_yasg import openapi

from core.utils.schemas import BaseAPISchema
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
                    name='manager',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by manager ID. Example: host.com/?manager=1,2'
                ),
                openapi.Parameter(
                    name='assessors_count',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by assessors count.'
                ),
                openapi.Parameter(
                    name='status',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by status.'
                ),
                openapi.Parameter(
                    name='is_free_resource',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_BOOLEAN,
                    description='Filtering by free resources.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, name, manager__last_name, '
                                'assessors_count, status, date_of_creation.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create project',
            operation_description='The "manager" field is required if the user who '
                                  'creates the project is an operational manager.\n\n'
                                  'Statuses: active, pause, completed.',
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
            responses={**self.get_responses(204, 400, 401, 403, 404)}
        )


project_schema = ProjectSchema(tags=['projects'])
