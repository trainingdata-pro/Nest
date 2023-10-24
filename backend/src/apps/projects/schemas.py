from drf_yasg import openapi

from apps.export.services import allowed_types
from apps.export.serializers import ExportSerializer
from core.schemas import BaseAPISchema
from .models import Status, ProjectStatuses
from .serializers import ProjectWorkingHoursSerializer


class ProjectSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get project',
            operation_description='Get a specific project info.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project ID.'
                )
            ],
            responses={**self.get_responses(401, 404)}
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List projects',
            operation_description='Get list of projects.',
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
                    description='Filtering by manager ID.\nExample: host.com/?manager=1,2.'
                ),
                openapi.Parameter(
                    name='assessors_count',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by assessors count.'
                ),
                openapi.Parameter(
                    name='assessor_id',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by assessor id.'
                ),
                openapi.Parameter(
                    name='status',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by status. You can chose a few statuses.\n'
                                'Example: host.com/?status=active,pause.\n\n'
                                'Available statuses:\n'
                                f'{", ".join([f"{item[0]} ({item[1]})" for item in ProjectStatuses.choices])}'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, name, manager__last_name, '
                                'assessors_count, status, date_of_creation'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create project',
            operation_description='The "manager" field is required if the user who '
                                  'creates the project is an operational manager.\n'
                                  'Allowed statuses: new, pilot, active, pause, completed',
            responses={**self.get_responses(400, 401)}
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update project',
            operation_description='Update a specific project.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project ID.'
                )
            ],
            responses={**self.get_responses(400, 401, 403, 404)}
        )

    def destroy(self):
        return self.swagger_auto_schema(
            operation_summary='Delete project',
            operation_description='Delete a specific project.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project ID.'
                )
            ],
            responses={**self.get_responses(204, 400, 401, 403, 404)}
        )


class AssessorsForProjectSchema(BaseAPISchema):
    def get(self):
        return self.swagger_auto_schema(
            operation_summary='Assessors for a project',
            operation_description='Get all assessors for a specific project.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project ID.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, username, last_name, '
                                'manager__last_name, status'
                )
            ],
            responses={**self.get_responses(401)}
        )


class TagsSchema(BaseAPISchema):
    def get(self):
        return self.swagger_auto_schema(
            operation_summary='List tags',
            operation_description='Get list of project tags.',
            manual_parameters=[
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, name'
                )
            ],
            responses={**self.get_responses(401)}
        )


class ProjectWorkingHoursSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get project working hours',
            operation_description='Get a specific project working hours info.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project working hours ID.'
                )
            ],
            responses={**self.get_responses(401, 404)}
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List project working hours',
            operation_description='Get list of project working hours.',
            manual_parameters=[
                openapi.Parameter(
                    name='assessor',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by assessor ID.\nExample: host.com/?assessor=1,2.'
                ),
                openapi.Parameter(
                    name='project',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by project ID.\nExample: host.com/?project=1,2.'
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

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create project working hours',
            responses={
                201: ProjectWorkingHoursSerializer(),
                **self.get_responses(400, 401, 403)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update project working hours',
            operation_description='Update a specific project working hours.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique project working hours ID.'
                )
            ],
            responses={
                200: ProjectWorkingHoursSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )


class WorkLoadStatusSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get workload status',
            operation_description='Get a specific project workload status.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique workload status ID.'
                )
            ],
            responses={**self.get_responses(401, 404)}
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List workload statuses',
            operation_description='Get list of workload statuses.',
            manual_parameters=[
                openapi.Parameter(
                    name='assessor',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by assessor ID.\nExample: host.com/?assessor=1,2.'
                ),
                openapi.Parameter(
                    name='project',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by project ID.\nExample: host.com/?project=1,2.'
                ),
                openapi.Parameter(
                    name='status',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by status.\nExample: host.com/?status=full.\n\n'
                                f'Available statuses:\n'
                                f'{", ".join([f"{item[0]} ({item[1]})" for item in Status.choices])}'
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

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create workload status',
            operation_description='Available statuses:\n'
                                  f'{", ".join([f"{item[0]} ({item[1]})" for item in Status.choices])}',
            responses={**self.get_responses(400, 401, 403)}
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update workload status',
            operation_description='Update a specific workload status.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique workload status ID.'
                )
            ],
            responses={**self.get_responses(400, 401, 403, 404)}
        )


class ExportProjectsSchema(BaseAPISchema):
    def export_projects(self):
        return self.swagger_auto_schema(
            operation_summary='Export projects',
            operation_description='Returns unique celery task ID.',
            manual_parameters=[
                openapi.Parameter(
                    name='type',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    required=True,
                    description=f'Output file type.\nAvailable types: {", ".join(allowed_types())}'
                )
            ],
            responses={
                202: ExportSerializer(),
                **self.get_responses(401)
            }
        )

    def export_assessors(self):
        return self.swagger_auto_schema(
            operation_summary='Export assessors',
            operation_description='Export assessors for a specific project.\n\n'
                                  'Returns unique celery task ID',
            manual_parameters=[
                openapi.Parameter(
                    name='type',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    required=True,
                    description=f'Output file type.\nAvailable types: {", ".join(allowed_types())}'
                ),
                openapi.Parameter(
                    name='project',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    required=True,
                    description='Unique project ID.'
                )
            ],
            responses={
                202: ExportSerializer(),
                **self.get_responses(401)
            }
        )


project_schema = ProjectSchema(tags=['projects'])
project_schema2 = AssessorsForProjectSchema(tags=['projects'])
tags_schema = TagsSchema(tags=['projects'])
project_wh_schema = ProjectWorkingHoursSchema(tags=['projects'])
workload_schema = WorkLoadStatusSchema(tags=['projects'])
export_schema = ExportProjectsSchema(tags=['export'])
