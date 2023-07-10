from drf_yasg import openapi

from core.schemas import BaseAPISchema
from . import serializers


class AssessorSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get assessor',
            operation_description='Get a specific assessor',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List assessors',
            operation_description='Get list of assessors',
            manual_parameters=[
                openapi.Parameter(
                    name='username',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor username.'
                ),
                openapi.Parameter(
                    name='last_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor last_name.'
                ),
                openapi.Parameter(
                    name='first_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor first_name.'
                ),
                openapi.Parameter(
                    name='middle_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor middle_name.'
                ),
                openapi.Parameter(
                    name='projects',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_INTEGER
                    ),
                    description='Filtering by project ID'
                ),
                openapi.Parameter(
                    name='is_busy',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_BOOLEAN,
                    description='Filtering by status.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: username, last_name, first_name, '
                                'middle_name, manager, is_busy'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(401)
            }
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create assessor',
            operation_description='Create new assessor',
            responses={
                201: serializers.CreateAssessorSerializer(),
                **self.get_responses(400, 401)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update assessor',
            operation_description='Update assessor',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def destroy(self):
        return self.swagger_auto_schema(
            operation_summary='Delete assessor',
            operation_description='Delete a specific assessor',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID'
                )
            ],
            responses={**self.get_responses(204, 401, 403, 404)}
        )


class CheckAssessorSchema(BaseAPISchema):
    def get(self):
        return self.swagger_auto_schema(
            operation_summary='Check assessor',
            operation_description='Check if assessor exists',
            manual_parameters=[
                openapi.Parameter(
                    name='last_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='New assessor last name'
                ),
                openapi.Parameter(
                    name='first_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='New assessor first name'
                ),
                openapi.Parameter(
                    name='middle_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='New assessor middle name')
                ,
            ],
            responses={
                200: serializers.CheckAssessorSerializer,
                **self.get_responses(400, 401)
            }
        )


class AssessorProjectsSchema(BaseAPISchema):
    def add_project(self):
        return self.swagger_auto_schema(
            operation_summary='Add projects',
            operation_description='Add projects to a specific assessor',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID'
                )
            ],
            responses={
                200: serializers.AssessorSerializer,
                **self.get_responses(400, 401, 404)
            }
        )

    def delete_project(self):
        return self.swagger_auto_schema(
            operation_summary='Delete projects',
            operation_description='Delete projects from a specific assessor.\n'
                                  'If the "all" parameter is "true", then all '
                                  'assessor\'s projects will be deleted. '
                                  'In this case, the "projects" list may not be '
                                  'specified.',
            responses={
                200: serializers.AssessorSerializer,
                **self.get_responses(400, 401, 404)
            }
        )


assessor_schema = AssessorSchema(tags=['assessors'])
check_assessor_schema = CheckAssessorSchema(tags=['assessors'])
projects_schema = AssessorProjectsSchema(tags=['assessors'])
