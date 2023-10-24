from drf_yasg import openapi

from apps.users.serializers import UserSerializer
from core.schemas import BaseAPISchema


class ResetPasswordSchema(BaseAPISchema):
    def reset(self):
        return self.swagger_auto_schema(
            operation_summary='Reset user password',
            operation_description='Accepts the user\'s email, verifies it, '
                                  'and sends a password reset confirmation code.',
            responses={
                **self.get_responses(204, 400)
            }
        )

    def set(self):
        return self.swagger_auto_schema(
            operation_summary='Set user password',
            operation_description='Accepts a unique password reset token and a new password. '
                                  'If validation is successful, sets a new password.',
            responses={
                **self.get_responses(204, 400)
            }
        )

    def change(self):
        return self.swagger_auto_schema(
            operation_summary='Change user password',
            operation_description='Accepts the user\'s old and new password and, '
                                  'if verified successfully, changes the password '
                                  'to the new one.',
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


class UserActivateSchema(BaseAPISchema):
    def post(self):
        return self.swagger_auto_schema(
            operation_summary='Activate user',
            operation_description='Checks the activation code and '
                                  'activates the user account.',
            responses={
                200: UserSerializer(),
                **self.get_responses(400)
            }
        )


class TokenSchema(BaseAPISchema):
    def new(self):
        return self.swagger_auto_schema(
            operation_summary='Create auth token',
            operation_description='Takes a set of user credentials and returns '
                                  'an access and refresh JSON web token pair to '
                                  'prove the authentication of those credentials.',
            responses={
                201: openapi.Response(
                    description='',
                    schema=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'access': openapi.Schema(
                                type=openapi.TYPE_STRING
                            ),
                            'refresh': openapi.Schema(
                                type=openapi.TYPE_STRING
                            )
                        }
                    )
                ),
                **self.get_responses(401)
            }
        )

    def refresh(self):
        return self.swagger_auto_schema(
            operation_summary='Refresh token',
            operation_description='Takes a refresh type JSON web token and returns '
                                  'an access type JSON web token if the refresh token '
                                  'is valid.'
        )


password_schema = ResetPasswordSchema(tags=['auth'])
user_activate_schema = UserActivateSchema(tags=['auth'])
token_schema = TokenSchema(tags=['auth'])
