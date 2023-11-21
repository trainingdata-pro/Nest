from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.authapp.tasks import send_confirmation_code
from core.mixins import BaseAPIViewSet
from core import permissions
from .filters import UserFilter, ManagerProfileFilter
from .models import ManagerProfile
from . import serializers, schemas


@method_decorator(name='retrieve', decorator=schemas.user_schema.retrieve())
@method_decorator(name='list', decorator=schemas.user_schema.list())
@method_decorator(name='create', decorator=schemas.user_schema.create())
@method_decorator(name='partial_update', decorator=schemas.user_schema.partial_update())
class UserAPIViewSet(BaseAPIViewSet):
    """ The main view to interact with user object """
    queryset = get_user_model().objects.all()
    permission_classes = {
        'create': (AllowAny,),
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'partial_update': (IsAuthenticated, permissions.UserPermission)
    }
    serializer_class = {
        'create': serializers.CreateUserSerializer,
        'retrieve': serializers.UserSerializer,
        'list': serializers.UserSerializer,
        'partial_update': serializers.UpdateUserSerializer
    }
    http_method_names = ['get', 'post', 'patch']
    filterset_class = UserFilter
    ordering_fields = ['pk', 'username', 'last_name']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_confirmation_code.delay(email=user.email, code=user.code.code)
        response = serializers.UserSerializer(user)
        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        obj = self.update_obj(request)
        response = serializers.UserSerializer(obj)
        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='retrieve', decorator=schemas.manager_profile_schema.retrieve())
@method_decorator(name='list', decorator=schemas.manager_profile_schema.list())
@method_decorator(name='partial_update', decorator=schemas.manager_profile_schema.partial_update())
class ManagerAPIViewSet(BaseAPIViewSet):
    """ The main view to interact with manager profile object """
    queryset = ManagerProfile.objects.all().select_related('user')
    serializer_class = {
        'retrieve': serializers.ManagerProfileSerializer,
        'list': serializers.ManagerProfileSerializer,
        'partial_update': serializers.UpdateManagerProfileSerializer
    }
    permission_classes = {
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'partial_update': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.IsCurrentManager
        )
    }
    http_method_names = ['get', 'patch']
    filterset_class = ManagerProfileFilter
    ordering_fields = ['pk']

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        obj = self.update_obj(request)
        response = serializers.ManagerProfileSerializer(obj)
        return Response(response.data, status=status.HTTP_200_OK)
