from django.db.models import Count
from django.utils.decorators import method_decorator
from rest_framework import status, generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from assessors.models import Assessor
from assessors.serializers import AssessorSerializer
from core.utils.permissions import IsManager, ProjectPermission
from core.utils.common import BaseAPIViewSet
from users.models import Manager
from .filters import ProjectFilter
from .models import Project
from .schemas import project_schema, project_schema2
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
        'create': (IsAuthenticated, IsManager),
        'partial_update': (IsAuthenticated, IsManager, ProjectPermission),
        'destroy': (IsAuthenticated, IsManager, ProjectPermission)
    }
    serializer_class = {
        'retrieve': serializers.ProjectSerializer,
        'list': serializers.ProjectSerializer,
        'create': serializers.CreateProjectSerializer,
        'partial_update': serializers.CreateProjectSerializer

    }
    http_method_names = ['get', 'post', 'patch', 'delete']
    filterset_class = ProjectFilter
    ordering_fields = ['pk', 'name', 'manager__last_name', 'assessors_count',
                       'status', 'date_of_creation']

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
                    .prefetch_related('manager__user')
                    .order_by('manager__last_name', 'name', '-date_of_creation'))
        else:
            manager = user.manager
            if manager.is_operational_manager:
                team = Manager.objects.filter(operational_manager=manager)
                return (Project.objects
                        .filter(manager__in=team)
                        .annotate(assessors_count=Count('assessors'))
                        .prefetch_related('manager__user')
                        .order_by('manager__last_name', 'name', '-date_of_creation'))

            return (Project.objects
                    .filter(manager=manager)
                    .annotate(assessors_count=Count('assessors'))
                    .prefetch_related('manager__user')
                    .order_by('manager__last_name', 'name', '-date_of_creation'))


@method_decorator(name='get', decorator=project_schema2.get())
class GetAllAssessorForProject(generics.ListAPIView):
    queryset = Assessor.objects.all()
    serializer_class = AssessorSerializer
    permission_classes = (IsAuthenticated,)
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name',
        'status'
    ]

    def get_queryset(self):
        project_pk = self.kwargs.get('pk')
        return (Assessor.objects
                .filter(projects__in=[project_pk])
                .select_related('manager__user')
                .prefetch_related('projects__manager', 'second_manager')
                .order_by('last_name'))
