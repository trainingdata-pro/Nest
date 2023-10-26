from drf_yasg import openapi

from core.schemas import BaseAPISchema
from . import serializers


class SkillsSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get skill',
            operation_description='Get a specific skill info.',
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
            operation_description='Get list of skills.',
            manual_parameters=[
                openapi.Parameter(
                    name='title',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by skill title.\n'
                                'Example: host.com/?title=cvat.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, title.'
                )
            ],
            responses={**self.get_responses(401)}
        )


class AssessorSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get assessor',
            operation_description='Get a specific assessor info.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
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
            operation_description='Get list of assessors.',
            manual_parameters=[
                openapi.Parameter(
                    name='username',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor username.'
                ),
                openapi.Parameter(
                    name='full_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor full name.'
                ),
                openapi.Parameter(
                    name='manager',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by manager ID.'
                ),
                openapi.Parameter(
                    name='projects',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by project ID.\n'
                                'Example: host.com/?projects=1,2.'
                ),
                openapi.Parameter(
                    name='skills',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by skill ID.\n'
                                'Example: host.com/?skills=1,2.'
                ),
                openapi.Parameter(
                    name='second_manager',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by second manager ID.\n'
                                'Example: host.com/?second_manager=1,2.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, username, last_name, '
                                'manager__last_name, status, projects.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create assessor',
            operation_description='Create a new assessor.',
            responses={
                201: serializers.CreateUpdateAssessorSerializer(),
                **self.get_responses(400, 401)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update assessor',
            operation_description='Update a specific assessor.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def projects(self):
        return self.swagger_auto_schema(
            operation_summary='Update assessor projects',
            operation_description='Change a specific assessor projects list.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def skills(self):
        return self.swagger_auto_schema(
            operation_summary='Update assessor skills',
            operation_description='Change a specific assessor skills list.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def vacation(self):
        return self.swagger_auto_schema(
            operation_summary='Assessor vacation',
            operation_description='Send a specific assessor on vacation or '
                                  'return from vacation.\n\n'
                                  'vacation_date - required field when sending an assessor on vacation.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def free_resource(self):
        return self.swagger_auto_schema(
            operation_summary='Send / return assessor to free resources',
            operation_description='Send a specific assessor to free resources or '
                                  'return from free resources.\n'
                                  'Reason is required only when adding to free resources.\n'
                                  'Available reasons:\n'
                                  '- free_time (Есть свободное время)\n'
                                  '- project_reduction (Сокращение проекта)\n'
                                  '- project_mismatch (Не подходит текущему проекту)',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
                )
            ],
            responses={
                200: serializers.AssessorSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )

    def unpin(self):
        return self.swagger_auto_schema(
            operation_summary='Remove from a team',
            operation_description='Remove a specific assessor from a team.\n'
                                  'If a manager is specified, the assessor will be assigned '
                                  'to him, otherwise assessor will be added to free resources '
                                  'as assessor without a team.\n'
                                  'Available reasons:\n'
                                  '- project (Не смог работать со спецификой проекта)\n'
                                  '- work (Не сработались)\n'
                                  '- transfer (Передача проекта другому менеджеру)',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
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
            operation_description='If the reason has blacklist=True, then '
                                  'the assessor will be added to the blacklist. '
                                  'The "date" parameter is optional (the date '
                                  'when you can return to the assessor).',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
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
            operation_description='Check if assessor exists.\n'
                                  'Full_name or username must be specified.',
            manual_parameters=[
                openapi.Parameter(
                    name='full_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='New assessor full name.'
                ),
                openapi.Parameter(
                    name='username',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='New assessor username.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, username, last_name, '
                                'manager__last_name, status, projects.'
                )
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
            operation_description='Get a specific assessor credentials info.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor credentials ID.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, assessor.'
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
            operation_description='Get list of assessor credentials.',
            manual_parameters=[
                openapi.Parameter(
                    name='assessor',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor id.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, assessor.'
                )
            ],
            responses={**self.get_responses(401, 403)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create assessor credentials',
            operation_description='Create a specific assessor credentials.',
            responses={
                201: serializers.CreateUpdateAssessorCredentialsSerializer(),
                **self.get_responses(400, 403, 401)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update assessor credentials',
            operation_description='Update a specific assessor credentials.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique credentials ID.'
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
            operation_description='Delete a specific assessor credentials.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique credentials ID.'
                )
            ],
            responses={**self.get_responses(204, 401, 403, 404)}
        )


class FreeResourcesSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get free resource',
            operation_description='Get a specific free resource info.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
                )
            ],
            responses={**self.get_responses(401, 404)}
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List free resources',
            operation_description='Get list of free resources.',
            manual_parameters=[
                openapi.Parameter(
                    name='username',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor username.'
                ),
                openapi.Parameter(
                    name='full_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by assessor full name.'
                ),
                openapi.Parameter(
                    name='skills',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by skill ID.\n'
                                'Example: host.com/?skills=1,2.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, username, last_name, manager__last_name.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Take free resource',
            operation_description='If an assessor doesn\'t have a team, then it\'s necessary '
                                  'to specify the "manager" field, otherwise specify the '
                                  '"second_manager" and "project" fields',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique assessor ID.'
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
