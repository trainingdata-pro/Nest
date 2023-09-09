from drf_yasg import openapi

from core.utils.schemas import BaseAPISchema
from . import serializers


class BaseUserSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get user',
            operation_description='Get a specific user',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique user ID'
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
            operation_description='Get Get list of users',
            manual_parameters=[
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
                    description='Filtering by status. You can chose a few statuses. '
                                'Example: Example: host.com/?status=admin,manager'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, username, last_name.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create user',
            operation_description='Create new user.\n'
                                  'Available statuses: admin, manager.',
            responses={
                201: serializers.UserSerializer(),
                **self.get_responses(400)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update user',
            operation_description='Update user',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique user ID'
                )
            ],
            responses={
                200: serializers.UserSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )


class UserActivateSchema(BaseAPISchema):
    def post(self):
        return self.swagger_auto_schema(
            operation_summary='Activate user',
            operation_description='Activate user',
            responses={
                200: serializers.UserSerializer(),
                **self.get_responses(400)
            }
        )


class ManagerProfileSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get manager profile',
            operation_description='Get a specific manager profile',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique manager profile ID'
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
            operation_description='Get list of manager profiles',
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
                    description='Which field to use when ordering the results. '
                                'Available fields: pk.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update manager profile',
            operation_description='Update a specific manager profile',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique manager profile ID'
                )
            ],
            responses={
                200: serializers.ManagerProfileSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )


class ResetPasswordSchema(BaseAPISchema):
    def reset(self):
        return self.swagger_auto_schema(
            operation_summary='Reset user password',
            operation_description='Generate and send a unique password reset token.',
            responses={
                **self.get_responses(204)
            }
        )

    def set(self):
        return self.swagger_auto_schema(
            operation_summary='Set user password',
            operation_description='Set new user password.',
            responses={
                **self.get_responses(204, 400)
            }
        )

    def change(self):
        return self.swagger_auto_schema(
            operation_summary='Change user password',
            operation_description='Change a specific user password.',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique user ID'
                )
            ],
            responses={
                **self.get_responses(204, 400, 401, 403)
            }
        )


user_schema = BaseUserSchema(tags=['users'])
user_activate_schema = UserActivateSchema(tags=['users'])
manager_profile_schema = ManagerProfileSchema(tags=['profiles'])
password_schema = ResetPasswordSchema(tags=['password'])
