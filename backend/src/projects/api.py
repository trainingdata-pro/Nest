from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import ProjectOwner
from core.utils import BaseAPIViewSet
from .filters import ProjectFilter
from .models import Project
from .schemas import project_schema
from . import serializers


@method_decorator(name='retrieve', decorator=project_schema.retrieve())
@method_decorator(name='list', decorator=project_schema.list())
@method_decorator(name='create', decorator=project_schema.create())
@method_decorator(name='partial_update', decorator=project_schema.partial_update())
@method_decorator(name='destroy', decorator=project_schema.destroy())
class ProjectAPIViewSet(BaseAPIViewSet):
    queryset = Project.objects.all().select_related('owner__user')
    permission_classes = {
        'create': (IsAuthenticated,),
        'partial_update': (IsAuthenticated, ProjectOwner),
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'destroy': (IsAuthenticated, ProjectOwner),
    }
    serializer_class = {
        'create': serializers.CreateProjectSerializer,
        'partial_update': serializers.CreateProjectSerializer,
        'retrieve': serializers.ProjectSerializer,
        'list': serializers.ProjectSerializer
    }
    http_method_names = ['get', 'post', 'patch', 'delete']
    filterset_class = ProjectFilter
    ordering_fields = ['name', 'owner', 'date_of_create']

    def get_serializer_class(self):
        return self.serializer_class[self.action]

    def get_permissions(self):
        action = self.action
        if action not in self.permission_classes:
            raise MethodNotAllowed(self.request.method)
        return [perm() for perm in self.permission_classes[action]]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        response = serializers.ProjectSerializer(project)

        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        response = serializers.ProjectSerializer(project)

        return Response(response.data, status=status.HTTP_200_OK)
