from typing import Iterable, Any, Dict

from django.db.models import Count, QuerySet, Sum, Q
from django.db.models.query import EmptyQuerySet
from django.http import Http404
from django.utils.decorators import method_decorator
from rest_framework import status, generics
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.assessors.models import Assessor
from apps.assessors.serializers import AssessorSerializer
from apps.export.serializers import ExportSerializer
from apps.export.services import ExportType
from apps.users.models import BaseUser
from core import permissions
from core.mixins import BaseAPIViewSet
from core.users import UserStatus
from .filters import (
    ProjectFilter,
    AllAssessorsForProjectFilter,
    ProjectWorkingHoursFilter,
    WorkLoadStatusFilter
)
from .models import (
    Project,
    ProjectTag,
    ProjectWorkingHours,
    WorkLoadStatus
)
from .tasks import (
    make_report_projects,
    make_report_assessors
)
from .utils import remove_assessors_from_project
from . import serializers, schemas


@method_decorator(name='retrieve', decorator=schemas.project_schema.retrieve())
@method_decorator(name='list', decorator=schemas.project_schema.list())
@method_decorator(name='create', decorator=schemas.project_schema.create())
@method_decorator(name='partial_update', decorator=schemas.project_schema.partial_update())
@method_decorator(name='destroy', decorator=schemas.project_schema.destroy())
@method_decorator(name='clear', decorator=schemas.project_schema.clear())
class ProjectAPIViewSet(BaseAPIViewSet):
    """ The main view to interact with project object """
    permission_classes = {
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'create': (
            IsAuthenticated,
            permissions.IsManager
        ),
        'partial_update': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.ProjectPermission,
            permissions.ProjectIsActive,
        ),
        'destroy': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.ProjectPermission,
            permissions.ProjectIsActive,
        ),
        'assessors': {
            IsAuthenticated,
            permissions.IsManager,
            permissions.ProjectPermission,
            permissions.ProjectIsActive
        },
        'clear': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.ProjectPermission,
            permissions.ProjectIsActive
        )
    }
    serializer_class = {
        'retrieve': serializers.ProjectSerializer,
        'list': serializers.ProjectSerializer,
        'create': serializers.CreateUpdateProjectSerializer,
        'partial_update': serializers.CreateUpdateProjectSerializer

    }
    http_method_names = ['get', 'post', 'patch', 'delete']
    filterset_class = ProjectFilter
    ordering_fields = ['pk', 'name', 'manager__last_name', 'assessors_count',
                       'status', 'date_of_creation', 'date_of_completion']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        response = serializers.ProjectSerializer(project)
        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        obj = self.update_obj(request)
        response = serializers.ProjectSerializer(obj)
        return Response(response.data, status=status.HTTP_200_OK)

    def destroy(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        self._check_project(instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def clear(self, request: Request, *args, **kwarg) -> Response:
        """ Remove all assessors from a specific project """
        project = self.get_object()
        if project.assessors.exists():
            remove_assessors_from_project(
                project,
                user=request.user.full_name
            )
        serializer = serializers.ProjectSerializer(project)
        return Response(serializer.data)

    @staticmethod
    def _check_project(project: Project) -> Project:
        """ Check if project has assessors """
        if project.assessors.exists():
            raise ValidationError(
                {'detail': ['Снимите исполнителей с текущего проекта, чтобы продолжить.']}
            )
        return project

    def get_queryset(self) -> QuerySet[Project]:
        """
        If the user's status is Admin or Analyst,
        returns all project objects;
        If the user's status is Manager (not teamlead),
        returns all project objects for current user.
        If the user's status is Manager (teamlead),
        returns all project objects for all managers in the
        user's team
        """
        user = self.request.user
        if user.is_superuser or user.status == UserStatus.ANALYST:
            return (Project.objects.all()
                    .annotate(assessors_count=Count('assessors'))
                    .prefetch_related('manager', 'tag')
                    .order_by('manager__last_name', 'name', '-date_of_creation'))
        else:
            if user.manager_profile.is_teamlead:
                team = BaseUser.objects.filter(status=UserStatus.MANAGER, manager_profile__teamlead=user)
                return (Project.objects
                        .filter(manager__in=team)
                        .annotate(assessors_count=Count('assessors'))
                        .prefetch_related('manager', 'tag')
                        .order_by('manager__last_name', 'name', '-date_of_creation'))

            return (Project.objects
                    .filter(manager=user)
                    .annotate(assessors_count=Count('assessors'))
                    .prefetch_related('manager', 'tag')
                    .order_by('manager__last_name', 'name', '-date_of_creation'))


@method_decorator(name='get', decorator=schemas.project_schema2.get())
class GetAllAssessorsForProject(generics.ListAPIView):
    """ Get all assessors for a specific project """
    serializer_class = AssessorSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.IsManager
    )
    filterset_class = AllAssessorsForProjectFilter
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name',
        'status',
        'total_working_hours'
    ]

    def list(self, request: Request, *args, **kwargs) -> Response:
        project_pk = kwargs.get('pk')
        self._can_view_project(project_pk)
        queryset = self.filter_queryset(self.get_queryset()).filter(projects__in=[project_pk])
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_serializer_context(self) -> Dict:
        context = super().get_serializer_context()
        context['project_pk'] = self.kwargs.get('pk')
        return context

    def get_queryset(self) -> QuerySet[Assessor]:
        project_pk = self.kwargs.get('pk')
        return (Assessor.objects
                .select_related('manager')
                .prefetch_related('projects__manager', 'second_manager')
                .annotate(total_working_hours=(Sum('project_working_hours__monday',
                                                   default=0,
                                                   filter=Q(project_working_hours__project__pk=project_pk))
                                               + Sum('project_working_hours__tuesday',
                                                     default=0,
                                                     filter=Q(project_working_hours__project__pk=project_pk))
                                               + Sum('project_working_hours__wednesday',
                                                     default=0,
                                                     filter=Q(project_working_hours__project__pk=project_pk))
                                               + Sum('project_working_hours__thursday',
                                                     default=0,
                                                     filter=Q(project_working_hours__project__pk=project_pk))
                                               + Sum('project_working_hours__friday',
                                                     default=0,
                                                     filter=Q(project_working_hours__project__pk=project_pk))
                                               + Sum('project_working_hours__saturday',
                                                     default=0,
                                                     filter=Q(project_working_hours__project__pk=project_pk))
                                               + Sum('project_working_hours__sunday',
                                                     default=0,
                                                     filter=Q(project_working_hours__project__pk=project_pk))))
                .order_by('pk'))

    def _can_view_project(self, pk: int) -> None:
        """
        Check if the user can interact with a project.
        :param pk: Unique project pk
        """
        obj = get_object_or_404(Project, pk=pk)
        permission = permissions.ProjectPermission()
        if not permission.has_object_permission(
                request=self.request,
                view=self,
                obj=obj
        ):
            raise Http404


@method_decorator(name='get', decorator=schemas.tags_schema.get())
class TagsApiView(generics.ListAPIView):
    """ Get project tags"""
    queryset = ProjectTag.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ProjectTagSerializer
    ordering_fields = ['pk', 'name']


@method_decorator(name='retrieve', decorator=schemas.project_wh_schema.retrieve())
@method_decorator(name='list', decorator=schemas.project_wh_schema.list())
@method_decorator(name='create', decorator=schemas.project_wh_schema.create())
@method_decorator(name='partial_update', decorator=schemas.project_wh_schema.partial_update())
class ProjectWorkingHoursAPIViewSet(BaseAPIViewSet):
    """ The main view to interact with project working hours """
    queryset = ProjectWorkingHours.objects.filter().select_related('assessor', 'project')
    permission_classes = {
        'retrieve': (
            IsAuthenticated,
            permissions.IsManager
        ),
        'list': (
            IsAuthenticated,
            permissions.IsManager
        ),
        'create': (
            IsAuthenticated,
            permissions.IsManager
        ),
        'partial_update': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.ProjectRelatedPermission
        )
    }
    serializer_class = {
        'retrieve': serializers.ProjectWorkingHoursSerializer,
        'list': serializers.ProjectWorkingHoursSerializer,
        'create': serializers.CreateProjectWorkingHoursSerializer,
        'partial_update': serializers.UpdateProjectWorkingHoursSerializer
    }
    http_method_names = ['get', 'post', 'patch']
    filterset_class = ProjectWorkingHoursFilter
    ordering_fields = ['pk']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project_wh = serializer.save()
        response = serializers.ProjectWorkingHoursSerializer(project_wh)
        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        obj = self.update_obj(request)
        response = serializers.ProjectWorkingHoursSerializer(obj)
        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='retrieve', decorator=schemas.workload_schema.retrieve())
@method_decorator(name='list', decorator=schemas.workload_schema.list())
@method_decorator(name='create', decorator=schemas.workload_schema.create())
@method_decorator(name='partial_update', decorator=schemas.workload_schema.partial_update())
class WorkLoadStatusAPIViewSet(BaseAPIViewSet):
    """ The main view to interact with project workload status """
    queryset = WorkLoadStatus.objects.filter().select_related('assessor', 'project')
    permission_classes = {
        'retrieve': (
            IsAuthenticated,
            permissions.IsManager
        ),
        'list': (
            IsAuthenticated,
            permissions.IsManager
        ),
        'create': (
            IsAuthenticated,
            permissions.IsManager
        ),
        'partial_update': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.ProjectRelatedPermission
        )
    }
    serializer_class = {
        'retrieve': serializers.WorkLoadStatusSerializer,
        'list': serializers.WorkLoadStatusSerializer,
        'create': serializers.CreateWorkLoadStatusSerializer,
        'partial_update': serializers.UpdateWorkLoadStatusSerializer
    }
    http_method_names = ['get', 'post', 'patch']
    filterset_class = WorkLoadStatusFilter
    ordering_fields = ['pk']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        workload = serializer.save()
        response = serializers.WorkLoadStatusSerializer(workload)
        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        obj = self.update_obj(request)
        response = serializers.WorkLoadStatusSerializer(obj)
        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='get', decorator=schemas.export_schema.export_projects())
class ExportProjectsAPIView(generics.GenericAPIView):
    """ Export info about completed projects """
    queryset = EmptyQuerySet
    permission_classes = (IsAuthenticated,)
    serializer_class = ExportSerializer

    def get(self, request: Request, *args, **kwargs) -> Response:
        export_type = request.GET.get('type', '').lower()
        ExportType.validate(export_type)
        team = self._get_team()
        task = make_report_projects.delay(export_type=export_type, team=team)
        return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)

    def _get_team(self) -> Iterable[int]:
        """
        If the user's status is Admin, returns all managers;
        If the user's status is Manager (teamlead),
        returns all managers in the user's team.
        :return: List of manager IDs
        """
        managers = BaseUser.objects.filter(
            status=UserStatus.MANAGER,
            manager_profile__is_teamlead=False
        )
        user = self.request.user
        if user.is_superuser:
            return list(managers.values_list('pk', flat=True))
        else:
            if user.manager_profile.is_teamlead:
                return list(managers.filter(manager_profile__teamlead=user).values_list('pk', flat=True))
            else:
                return [user.pk]


@method_decorator(name='get', decorator=schemas.export_schema.export_assessors())
class ExportAssessorsForProjectAPIView(generics.GenericAPIView):
    """ Export all assessors for a specific project """
    queryset = EmptyQuerySet
    permission_classes = (IsAuthenticated,)
    serializer_class = ExportSerializer

    def get(self, request: Request, *args, **kwargs) -> Response:
        export_type = request.GET.get('type', '').lower()
        ExportType.validate(export_type)
        project_pk = self._check_project_pk(request.GET.get('project'))
        task = make_report_assessors.delay(export_type=export_type, project_id=project_pk)
        return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)

    @staticmethod
    def _check_project_pk(pk: str | int | float) -> int:
        """ Check if project pk is valid """
        try:
            project_id = int(pk)
        except (ValueError, TypeError):
            raise ValidationError(
                {'project': ['Invalid project ID.']}
            )
        return project_id
