from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from core.utils.common import BaseAPIViewSet
from core.utils.permissions import BaseUserPermission, IsCurrentManager
from .filters import ManagerFilter
from .models import Manager
from .schemas import users_schema, user_activate_schema, base_user_schema
from .utils import send_code
from . import serializers


@method_decorator(name='retrieve', decorator=users_schema.retrieve())
@method_decorator(name='list', decorator=users_schema.list())
@method_decorator(name='create', decorator=users_schema.create())
@method_decorator(name='partial_update', decorator=users_schema.partial_update())
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
        'partial_update': (IsAuthenticated, IsCurrentManager)
    }
    http_method_names = ['get', 'post', 'patch']
    filterset_class = ManagerFilter
    ordering_fields = ['pk', 'user__username', 'last_name']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        manager = serializer.save()
        send_code(email=manager.user.email, code=manager.user.code.code)
        response = serializers.ManagerSerializer(manager)

        return Response(response.data, status=status.HTTP_201_CREATED)


@method_decorator(name='post', decorator=user_activate_schema.post())
class UserActivateAPIView(generics.CreateAPIView):
    queryset = Manager.objects.all().select_related('user')
    serializer_class = serializers.CodeSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        active_user = serializer.save()
        response = serializers.ManagerSerializer(active_user)

        return Response(response.data, status=200)


@method_decorator(name='patch', decorator=base_user_schema.patch())
class UpdateUsernameAPIView(generics.UpdateAPIView):
    queryset = get_user_model()
    permission_classes = (IsAuthenticated, BaseUserPermission)
    serializer_class = serializers.UserSerializer
    http_method_names = ['patch']
