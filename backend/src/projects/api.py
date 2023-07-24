from django.db.models import Count
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.utils.permissions import ProjectOwnerOrTeamLead
from core.utils.common import BaseAPIViewSet
from users.models import Manager
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
    permission_classes = {
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'create': (IsAuthenticated,),
        'partial_update': (IsAuthenticated, ProjectOwnerOrTeamLead),
        'destroy': (IsAuthenticated, ProjectOwnerOrTeamLead)
    }
    serializer_class = {
        'retrieve': serializers.ProjectSerializer,
        'list': serializers.ProjectSerializer,
        'create': serializers.CreateProjectSerializer,
        'partial_update': serializers.CreateProjectSerializer

    }
    http_method_names = ['get', 'post', 'patch', 'delete']
    filterset_class = ProjectFilter
    ordering_fields = ['name', 'manager', 'assessors_count', 'status', 'date_of_creation']

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_project(instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def check_project(project):
        if project.assessors.exists():
            raise ValidationError(
                {'detail': ['Снимите исполнителей с текущего проекта, чтобы продолжить.']}
            )
        return project

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return (Project.objects.all()
                    .annotate(assessors_count=Count('assessors'))
                    .select_related('manager__user')
                    .order_by('manager__last_name', 'name', '-date_of_creation'))
        else:
            manager = user.manager
            if manager.is_operational_manager:
                team = Manager.objects.filter(operational_manager=manager)
                return (Project.objects
                        .filter(manager__in=team)
                        .annotate(assessors_count=Count('assessors'))
                        .select_related('manager__user')
                        .order_by('manager__last_name', 'name', '-date_of_creation'))

            return (Project.objects
                    .filter(manager=manager)
                    .annotate(assessors_count=Count('assessors'))
                    .select_related('manager__user')
                    .order_by('manager__last_name', 'name', '-date_of_creation'))

# @method_decorator(name='retrieve', decorator=project_schema.retrieve())
# @method_decorator(name='list', decorator=project_schema.list())
# @method_decorator(name='create', decorator=project_schema.create())
# @method_decorator(name='partial_update', decorator=project_schema.partial_update())
# @method_decorator(name='destroy', decorator=project_schema.destroy())
# class ProjectAPIViewSet(BaseAPIViewSet):
#     queryset = (Project.objects
#                 .select_related('owner__user')
#                 .order_by('owner__last_name', 'name', '-date_of_create'))
#     permission_classes = {
#         'create': (IsAuthenticated,),
#         'partial_update': (IsAuthenticated, ProjectOwner),
#         'retrieve': (IsAuthenticated,),
#         'list': (IsAuthenticated,),
#         'destroy': (IsAuthenticated, ProjectOwner),
#     }
#     serializer_class = {
#         'create': serializers.CreateProjectSerializer,
#         'partial_update': serializers.CreateProjectSerializer,
#         'retrieve': serializers.ProjectSerializer,
#         'list': serializers.ProjectSerializer
#     }
#     http_method_names = ['get', 'post', 'patch', 'delete']
#     filterset_class = ProjectFilter
#     ordering_fields = ['name', 'owner', 'date_of_create']
#
#     def get_serializer_class(self):
#         return self.serializer_class[self.action]
#
#     def get_permissions(self):
#         action = self.action
#         if action not in self.permission_classes:
#             raise MethodNotAllowed(self.request.method)
#         return [perm() for perm in self.permission_classes[action]]
#
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         project = serializer.save()
#         response = serializers.ProjectSerializer(project)
#
#         return Response(response.data, status=status.HTTP_201_CREATED)
#
#     def partial_update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(
#             instance,
#             data=request.data,
#             partial=True
#         )
#         serializer.is_valid(raise_exception=True)
#         project = serializer.save()
#         response = serializers.ProjectSerializer(project)
#
#         return Response(response.data, status=status.HTTP_200_OK)
