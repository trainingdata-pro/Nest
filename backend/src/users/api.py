from django.utils.decorators import method_decorator
from rest_framework import status, generics
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core import permissions
from core.utils import BaseAPIViewSet
from .filters import ManagerFilter
from .models import Manager
from .schemas import users_schema, user_activate_schema
from .utils import send_code
from . import serializers


@method_decorator(name='retrieve', decorator=users_schema.retrieve())
@method_decorator(name='list', decorator=users_schema.list())
@method_decorator(name='create', decorator=users_schema.create())
class ManagerAPIViewSet(BaseAPIViewSet):
    queryset = Manager.objects.all().select_related('user')
    serializer_class = {
        'create': serializers.CreateManagerSerializer,
        'retrieve': serializers.ManagerSerializer,
        'list': serializers.ManagerSerializer,
        # 'team': serializers.ManagerSerializer
    }
    permission_classes = {
        'create': (AllowAny,),
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        # 'team': (IsAuthenticated, permissions.IsOperationalManagerOrAdmin)
    }
    http_method_names = ['get', 'post']
    filterset_class = ManagerFilter

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        manager = serializer.save()
        send_code(email=manager.user.email, code=manager.user.code.code)
        response = serializers.ManagerSerializer(manager)

        return Response(response.data, status=status.HTTP_201_CREATED)

    # @users_schema.team()
    # @action(detail=True, methods=['get'])
    # def team(self, request, **kwargs):
    #     manager = self.get_object()
    #     response = self.get_serializer(data=manager.team, many=True)
    #     queryset = self.paginate_queryset(response.data)
    #
    #     return self.get_paginated_response(queryset)


@method_decorator(name='post', decorator=user_activate_schema.post())
class UserActivateAPIView(generics.CreateAPIView):
    queryset = Manager.objects.all().select_related('user')
    serializer_class = serializers.CodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        active_user = serializer.save()
        response = serializers.ManagerSerializer(active_user)

        return Response(response.data, status=200)
