from drf_yasg import openapi

from core.utils.schemas import BaseAPISchema
from . import serializers


class UserSchema(BaseAPISchema):
    def retrieve(self):
        return self.swagger_auto_schema(
            operation_summary='Get manager',
            operation_description='Get a specific manager',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique manager ID'
                )
            ],
            responses={
                201: serializers.ManagerSerializer(),
                **self.get_responses(401, 404)
            }
        )

    def list(self):
        return self.swagger_auto_schema(
            operation_summary='List managers',
            operation_description='Get list of managers',
            manual_parameters=[
                openapi.Parameter(
                    name='full_name',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_STRING,
                    description='Case-independent filtering by manager full name.'
                ),
                openapi.Parameter(
                    name='is_operational_manager',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_BOOLEAN,
                    description='Filtering by operational managers.'
                ),
                openapi.Parameter(
                    name='operational_manager',
                    in_=openapi.IN_QUERY,
                    type=openapi.TYPE_INTEGER,
                    description='Filtering by operational manager ID.'
                ),
                openapi.Parameter(
                    name='ordering',
                    type=openapi.TYPE_STRING,
                    in_=openapi.IN_QUERY,
                    description='Which field to use when ordering the results. '
                                'Available fields: pk, last_name, user__username.'
                )
            ],
            responses={**self.get_responses(401)}
        )

    def create(self):
        return self.swagger_auto_schema(
            operation_summary='Create manager',
            operation_description='Create new manager',
            responses={
                201: serializers.ManagerSerializer(),
                **self.get_responses(400)
            }
        )

    def partial_update(self):
        return self.swagger_auto_schema(
            operation_summary='Update manager',
            operation_description='Update a specific manager',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique manager ID'
                )
            ],
            responses={
                200: serializers.ManagerSerializer(),
                **self.get_responses(400, 401, 403, 404)
            }
        )


class UserActivateSchema(BaseAPISchema):
    def post(self):
        return self.swagger_auto_schema(
            operation_summary='Activate manager',
            operation_description='Activate manager',
            responses={
                200: serializers.ManagerSerializer(),
                **self.get_responses(400)
            }
        )


class BaseUserSchema(BaseAPISchema):
    def patch(self):
        return self.swagger_auto_schema(
            operation_summary='Update base user',
            operation_description='Update base user',
            manual_parameters=[
                openapi.Parameter(
                    name='id',
                    type=openapi.TYPE_INTEGER,
                    in_=openapi.IN_PATH,
                    description='Unique base user ID'
                )
            ],
            responses={
                200: serializers.UserSerializer(),
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
                    description='Unique base user ID'
                )
            ],
            responses={
                **self.get_responses(204, 400, 401, 403)
            }
        )


users_schema = UserSchema(tags=['users'])
user_activate_schema = UserActivateSchema(tags=['users'])
base_user_schema = BaseUserSchema(tags=['users'])
password_schema = ResetPasswordSchema(tags=['password'])
