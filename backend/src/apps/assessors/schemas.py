from drf_yasg import openapi

from core.utils.schemas import BaseAPISchema
from . import serializers


class SkillsSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get skill',
            operation_description='Get a specific skill',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique skill ID'
                )
            ],
            responses={
                200: serializers.SkillSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List skills',
            operation_description='Get list of skills',
            manual_parameters=[
                openapi.Parameter(
                    name='title',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by skill title.\n'
                                'Example: host.com/?title=cvat'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, title'
                )
            ],
            responses={**self.get_responses(401)}
        )


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
                    description='Case-independent filtering by assessor username'
                ),
                openapi.Parameter(
                    name='last_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor last_name'
                ),
                openapi.Parameter(
                    name='first_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor first_name'
                ),
                openapi.Parameter(
                    name='middle_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor middle_name'
                ),
                openapi.Parameter(
                    name='manager',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by manager ID'
                ),
                openapi.Parameter(
                    name='projects',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by project ID. Example: host.com/?projects=1,2'
                ),
                openapi.Parameter(
                    name='status',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by status.'
                ),
                openapi.Parameter(
                    name='skills',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by skill ID. Example: host.com/?skills=1,2'
                ),
                openapi.Parameter(
                    name='is_free_resource',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_BOOLEAN,
                    description='Filtering free resources.'
                ),
                openapi.Parameter(
                    name='second_manager',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by second manager ID. Example: host.com/?second_manager=1,2'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, username, last_name, manager__last_name, status'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create assessor',
            operation_description='If the manager field is None, then the assessor '
                                  'will be immediately added to free resources as an '
                                  'assessor without a team.\n\n'
                                  'Statuses: full, partial, reserved',
            responses={
                201: serializers.CreateUpdateAssessorSerializer(),
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

    def fire(self):
        return self.swagger_auto_schema(
            operation_summary='Fire assessor',
            operation_description='Fire a specific assessor',
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

    def blacklist(self):
        return self.swagger_auto_schema(
            operation_summary='Add assessor to blacklist',
            operation_description='Add a specific assessor to blacklist',
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
            ],
            responses={
                200: serializers.CheckAssessorSerializer,
                **self.get_responses(400, 401)
            }
        )


class AssessorCredentialsSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get assessor credentials',
            operation_description='Get a specific assessor credentials',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor credentials ID'
                )
            ],
            responses={
                200: serializers.AssessorCredentialsSerializer(),
                **self.get_responses(401, 403, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List assessor credentials',
            operation_description='Get list of assessor credentials',
            manual_parameters=[
                openapi.Parameter(
                    name='assessor',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor id'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, assessor'
                )
            ],
            responses={**self.get_responses(401, 403)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create assessor credentials',
            operation_description='Create assessor credentials',
            responses={
                201: serializers.CreateUpdateAssessorCredentialsSerializer(),
                **self.get_responses(400, 403, 401)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update assessor credentials',
            operation_description='Update assessor credentials',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor credentials ID'
                )
            ],
            responses={
                200: serializers.CreateUpdateAssessorCredentialsSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def destroy(self):
        return self.swagger_auto_schema(
            operation_summary='Delete assessor credentials',
            operation_description='Delete assessor credentials',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor credentials ID'
                )
            ],
            responses={**self.get_responses(204, 401, 403, 404)}
        )


class FreeResourcesSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get free resource',
            operation_description='Get a specific free resource',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID'
                )
            ],
            responses={**self.get_responses(401, 404)}
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List free resources',
            operation_description='Get list of free resources',
            manual_parameters=[
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, username, last_name, manager__last_name.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Take or return free resource',
            operation_description='Take or return a specific free resource',
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


assessor_schema = AssessorSchema(tags=['assessors'])
skills_schema = SkillsSchema(tags=['assessors'])
check_assessor_schema = CheckAssessorSchema(tags=['assessors'])
credentials_schema = AssessorCredentialsSchema(tags=['assessors'])
fr_schema = FreeResourcesSchema(tags=['free resources'])
