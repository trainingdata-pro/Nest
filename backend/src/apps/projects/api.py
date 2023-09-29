import os.path
from typing import Iterable, Union

from celery.result import AsyncResult
from django.conf import settings
from django.db.models import Count, QuerySet
from django.db.models.query import EmptyQuerySet
from django.http import FileResponse
from django.utils.decorators import method_decorator
from rest_framework import status, generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.assessors.models import Assessor
from apps.assessors.serializers import AssessorSerializer
from apps.users.models import BaseUser
from core.utils import permissions
from core.utils.mixins import BaseAPIViewSet
from core.utils.users import UserStatus
from .filters import ProjectFilter, ProjectWorkingHoursFilter, WorkLoadStatusFilter
from .models import Project, ProjectTag, ProjectWorkingHours, WorkLoadStatus
from .services.download_service import ContentType
from .tasks import make_report
from . import serializers, schemas


@method_decorator(name='retrieve', decorator=schemas.project_schema.retrieve())
@method_decorator(name='list', decorator=schemas.project_schema.list())
@method_decorator(name='create', decorator=schemas.project_schema.create())
@method_decorator(name='partial_update', decorator=schemas.project_schema.partial_update())
@method_decorator(name='destroy', decorator=schemas.project_schema.destroy())
class ProjectAPIViewSet(BaseAPIViewSet):
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
                       'status', 'date_of_creation']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        response = serializers.ProjectSerializer(project)

        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
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

    def destroy(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        self.check_project(instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def check_project(project: Project) -> Project:
        if project.assessors.exists():
            raise ValidationError(
                {'detail': ['Снимите исполнителей с текущего проекта, чтобы продолжить.']}
            )
        return project

    def get_queryset(self) -> QuerySet[Project]:
        user = self.request.user
        if user.is_superuser:
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
class GetAllAssessorForProject(generics.ListAPIView):
    queryset = Assessor.objects.all()
    serializer_class = AssessorSerializer
    permission_classes = (IsAuthenticated, permissions.IsManager)
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name',
        'status'
    ]

    def get_queryset(self) -> QuerySet[Assessor]:
        project_pk = self.kwargs.get('pk')
        return (Assessor.objects
                .filter(projects__in=[project_pk])
                .select_related('manager')
                .prefetch_related('projects__manager', 'second_manager')
                .order_by('last_name'))


@method_decorator(name='get', decorator=schemas.tags_schema.get())
class TagsApiView(generics.ListAPIView):
    queryset = ProjectTag.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ProjectTagSerializer
    ordering_fields = ['pk', 'name']


@method_decorator(name='retrieve', decorator=schemas.project_wh_schema.retrieve())
@method_decorator(name='list', decorator=schemas.project_wh_schema.list())
@method_decorator(name='create', decorator=schemas.project_wh_schema.create())
@method_decorator(name='partial_update', decorator=schemas.project_wh_schema.partial_update())
class ProjectWorkingHoursAPIViewSet(BaseAPIViewSet):
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

    def create(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project_wh = serializer.save()
        response = serializers.ProjectWorkingHoursSerializer(project_wh)

        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        project_wh = serializer.save()
        response = serializers.ProjectWorkingHoursSerializer(project_wh)

        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='retrieve', decorator=schemas.workload_schema.retrieve())
@method_decorator(name='list', decorator=schemas.workload_schema.list())
@method_decorator(name='create', decorator=schemas.workload_schema.create())
@method_decorator(name='partial_update', decorator=schemas.workload_schema.partial_update())
class WorkLoadStatusAPIViewSet(BaseAPIViewSet):
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

    def create(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        workload = serializer.save()
        response = serializers.WorkLoadStatusSerializer(workload)

        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        workload = serializer.save()
        response = serializers.WorkLoadStatusSerializer(workload)

        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='get', decorator=schemas.export_schema.export())
class ExportProjectsInfoAPIView(generics.GenericAPIView):
    queryset = EmptyQuerySet
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ExportProjectsSerializer

    def get(self, request: Request, *args, **kwargs) -> Response:
        export_type = request.GET.get('type', '').lower()
        ContentType.validate(export_type)
        team = self._get_team()
        task = make_report.delay(export_type=export_type, team=team)
        response = self.get_serializer(task.id)
        return Response(response, status=status.HTTP_202_ACCEPTED)

    def _get_team(self) -> Iterable[int]:
        managers = BaseUser.objects.filter(
                status=UserStatus.MANAGER,
                manager_profile__is_teamlead=False
            )
        user = self.request.user
        if user.is_superuser:
            return managers.values_list('pk', flat=True)
        else:
            if user.manager_profile.is_teamlead:
                return managers.filter(manager_profile__teamlead=user).values_list('pk', flat=True)
            else:
                return [user.pk]


@method_decorator(name='get', decorator=schemas.export_schema.status())
class GetExportResultAPIView(generics.GenericAPIView):
    queryset = EmptyQuerySet
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.DownloadStatusSerializer

    def get(self, request: Request, **kwargs) -> Response:
        task = AsyncResult(kwargs.get('task_id'))
        data = {
            'status': task.status,
            'filename': task.result
        }
        response = self.get_serializer(data)
        return Response(response)


@method_decorator(name='get', decorator=schemas.export_schema.download())
class DownloadReportAPIView(generics.GenericAPIView):
    queryset = EmptyQuerySet
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ExportProjectsSerializer

    def get(self, request: Request, **kwargs):
        filename = kwargs.get('filename')
        content_type = ContentType.get_content_type(filename)
        return self._get_response(content_type, filename)

    def _get_response(self, content_type: str, filename: str) -> Union[FileResponse, Response]:
        path_to_file = os.path.join(settings.MEDIA_ROOT, filename)
        if self._check_if_file_exists(path_to_file):
            def file_iterator(path: str, chunk_size: int = 4096):
                with open(path, 'rb') as file:
                    while True:
                        data = file.read(chunk_size)
                        if not data:
                            break
                        yield data

            response = FileResponse(
                file_iterator(path_to_file),
                content_type=content_type,
                as_attachment=True
            )
            response['Content-Disposition'] = f'attachment; filename={os.path.basename(path_to_file)}'
            return response
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def _check_if_file_exists(path) -> bool:
        return os.path.exists(path)
