from drf_yasg import openapi

from core.schemas import BaseAPISchema
from core.users import UserStatus
from . import serializers


class BaseUserSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get user',
            operation_description='Get a specific user info.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique user ID.'
                )
            ],
            responses={
                200: serializers.UserSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List users',
            operation_description='Get list of users.',
            manual_parameters=[
                openapi.Parameter(
                    name='username',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by user username.'
                ),
                openapi.Parameter(
                    name='full_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by user full name.'
                ),
                openapi.Parameter(
                    name='status',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Filtering by status. You can chose a few statuses.\n'
                                'Example: host.com/?status=admin,manager'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk, username, last_name.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create user',
            operation_description='Available statuses:\n'
                                  f'{", ".join([f"{item[0]} ({item[1]})" for item in UserStatus.choices])}',
            responses={
                201: serializers.UserSerializer(),
                **self.get_responses(400)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update user',
            operation_description='Update a specific user.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique user ID.'
                )
            ],
            responses={
                200: serializers.UserSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )


class ManagerProfileSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get manager profile',
            operation_description='Get a specific manager profile.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique manager profile ID.'
                )
            ],
            responses={
                201: serializers.ManagerProfileSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List managers',
            operation_description='Get list of manager profiles.',
            manual_parameters=[
                openapi.Parameter(
                    name='is_teamlead',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_BOOLEAN,
                    description='Filtering by teamlead.'
                ),
                openapi.Parameter(
                    name='teamlead',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by teamlead ID.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results.\n'
                                'Available fields: pk.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update manager profile',
            operation_description='Update a specific manager profile.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique manager profile ID.'
                )
            ],
            responses={
                200: serializers.ManagerProfileSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )


user_schema = BaseUserSchema(tags=['users'])
manager_profile_schema = ManagerProfileSchema(tags=['profiles'])
