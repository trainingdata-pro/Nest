from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from rest_framework import generics, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from apps.users.serializers import UserSerializer
from core import permissions
from .models import PasswordResetToken
from .tasks import reset_password
from . import schemas, serializers


@method_decorator(name='post', decorator=schemas.user_activate_schema.post())
class UserActivateAPIView(generics.CreateAPIView):
    """
    View for activating a specific user account.
    Checks the confirmation code and, if the code
    is valid, activates the account
    """
    queryset = get_user_model().objects.all()
    serializer_class = serializers.ConfirmationCodeSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        active_user = serializer.save()
        response = UserSerializer(active_user)
        return Response(response.data, status=200)


@method_decorator(name='post', decorator=schemas.password_schema.reset())
class ResetPasswordAPIView(generics.CreateAPIView):
    """
    View to send reset password token to the user's email
    (access recovery)
    """
    queryset = PasswordResetToken
    permission_classes = (AllowAny,)
    serializer_class = serializers.PasswordResetSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.save()
        reset_password.delay(email=token.user.email, token=token.token)
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(name='post', decorator=schemas.password_schema.set())
class PasswordSetAPIView(generics.CreateAPIView):
    """ View to set a new user's password """
    queryset = PasswordResetToken
    permission_classes = (AllowAny,)
    serializer_class = serializers.PasswordSetSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(name='patch', decorator=schemas.password_schema.change())
class ChangePasswordAPIView(generics.UpdateAPIView):
    """ View to change user's password """
    queryset = get_user_model()
    permission_classes = (IsAuthenticated, permissions.UserPermission)
    serializer_class = serializers.ChangePasswordSerializer
    http_method_names = ['patch']

    def update(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(name='post', decorator=schemas.token_schema.new())
class TokenObtainPairAPIView(TokenObtainPairView):
    """ Get JWT token (access and refresh) """
    def post(self, request: Request, *args, **kwargs) -> Response:
        return super().post(request, *args, **kwargs)


@method_decorator(name='post', decorator=schemas.token_schema.refresh())
class TokenRefreshAPIView(TokenRefreshView):
    """ Check and update refresh token """
    def post(self, request: Request, *args, **kwargs) -> Response:
        return super().post(request, *args, **kwargs)
