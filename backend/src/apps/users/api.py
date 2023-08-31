from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from core.utils.common import BaseAPIViewSet
from core.utils import permissions
from .filters import ManagerFilter
from .models import Manager, PasswordResetToken
from .utils import send_confirmation_code, send_reset_password_token
from . import serializers, schemas


@method_decorator(name='retrieve', decorator=schemas.users_schema.retrieve())
@method_decorator(name='list', decorator=schemas.users_schema.list())
@method_decorator(name='create', decorator=schemas.users_schema.create())
@method_decorator(name='partial_update', decorator=schemas.users_schema.partial_update())
class ManagerAPIViewSet(BaseAPIViewSet):
    queryset = Manager.objects.all().select_related('user')
    serializer_class = {
        'create': serializers.CreateManagerSerializer,
        'retrieve': serializers.ManagerSerializer,
        'list': serializers.ManagerSerializer,
        'partial_update': serializers.UpdateManagerSerializer
    }
    permission_classes = {
        'create': (AllowAny,),
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'partial_update': (
            IsAuthenticated,
            permissions.IsCurrentManager
        )
    }
    http_method_names = ['get', 'post', 'patch']
    filterset_class = ManagerFilter
    ordering_fields = ['pk', 'user__username', 'last_name']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        manager = serializer.save()
        send_confirmation_code(email=manager.user.email, code=manager.user.code.code)
        response = serializers.ManagerSerializer(manager)

        return Response(response.data, status=status.HTTP_201_CREATED)


@method_decorator(name='post', decorator=schemas.user_activate_schema.post())
class UserActivateAPIView(generics.CreateAPIView):
    queryset = Manager.objects.all().select_related('user')
    serializer_class = serializers.CodeSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        active_user = serializer.save()
        response = serializers.ManagerSerializer(active_user)
        return Response(response.data, status=200)


@method_decorator(name='patch', decorator=schemas.base_user_schema.patch())
class UpdateUsernameAPIView(generics.UpdateAPIView):
    queryset = get_user_model()
    permission_classes = (IsAuthenticated, permissions.BaseUserPermission)
    serializer_class = serializers.UserSerializer
    http_method_names = ['patch']


@method_decorator(name='post', decorator=schemas.password_schema.reset())
class ResetPasswordAPIView(generics.CreateAPIView):
    queryset = PasswordResetToken
    permission_classes = (AllowAny,)
    serializer_class = serializers.PasswordResetSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.save()
        if token is not None:
            send_reset_password_token(token.user.email, token.token)

        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(name='post', decorator=schemas.password_schema.set())
class PasswordSetAPIView(generics.CreateAPIView):
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
    queryset = get_user_model()
    permission_classes = (IsAuthenticated, permissions.BaseUserPermission)
    serializer_class = serializers.ChangePasswordSerializer
    http_method_names = ['patch']

    def update(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(status=status.HTTP_204_NO_CONTENT)
