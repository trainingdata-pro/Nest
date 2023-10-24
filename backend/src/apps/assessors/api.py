from typing import Dict

from django.contrib.postgres.search import SearchVector
from django.db.models import Q, QuerySet
from django.utils.decorators import method_decorator
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from core.mixins import BaseAPIViewSet
from core.users import UserStatus
from core import permissions
from apps.fired import serializers as fired_serializers
from apps.users.models import BaseUser
from .models import (
    AssessorState,
    Assessor,
    Skill,
    AssessorCredentials
)
from . import filters, serializers, schemas


@method_decorator(name='retrieve', decorator=schemas.skills_schema.retrieve())
@method_decorator(name='list', decorator=schemas.skills_schema.list())
class SkillsAPIViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('title')
    serializer_class = serializers.SkillSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']
    filterset_class = filters.SkillsFilter
    ordering_fields = ['pk', 'title']


@method_decorator(name='retrieve', decorator=schemas.assessor_schema.retrieve())
@method_decorator(name='list', decorator=schemas.assessor_schema.list())
@method_decorator(name='create', decorator=schemas.assessor_schema.create())
@method_decorator(name='partial_update', decorator=schemas.assessor_schema.partial_update())
@method_decorator(name='projects', decorator=schemas.assessor_schema.projects())
@method_decorator(name='skills', decorator=schemas.assessor_schema.skills())
@method_decorator(name='vacation', decorator=schemas.assessor_schema.vacation())
@method_decorator(name='free_resource', decorator=schemas.assessor_schema.free_resource())
@method_decorator(name='unpin', decorator=schemas.assessor_schema.unpin())
@method_decorator(name='fire', decorator=schemas.assessor_schema.fire())
class AssessorAPIViewSet(BaseAPIViewSet):
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
            permissions.AssessorPermission
        ),
        'projects': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.AssessorPermissionExtended
        ),
        'skills': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.AssessorPermissionExtended
        ),
        'vacation': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.AssessorPermission
        ),
        'free_resource': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.AssessorPermission
        ),
        'unpin': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.AssessorPermission
        ),
        'fire': (
            IsAuthenticated,
            permissions.IsManager,
            permissions.AssessorPermission
        )
    }
    serializer_class = {
        'list': serializers.AssessorSerializer,
        'retrieve': serializers.AssessorSerializer,
        'create': serializers.CreateUpdateAssessorSerializer,
        'partial_update': serializers.CreateUpdateAssessorSerializer,
        'projects': serializers.AssessorProjectsSerializer,
        'skills': serializers.AssessorSkillsSerializer,
        'vacation': serializers.AssessorVacationSerializer,
        'free_resource': serializers.AssessorFreeResourceSerializer,
        'unpin': serializers.UnpinAssessorSerializer,
        'fire': fired_serializers.FireAssessorSerializer
    }
    http_method_names = ['get', 'post', 'patch']
    filterset_class = filters.AssessorFilter
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name',
        'status',
        'projects'
    ]

    def get_queryset(self) -> QuerySet[Assessor]:
        user = self.request.user
        if user.is_superuser or user.status == UserStatus.ANALYST:
            queryset = Assessor.objects.exclude(state__in=AssessorState.fired_states())
        else:
            if user.manager_profile.is_teamlead:
                team = BaseUser.objects.filter(status=UserStatus.MANAGER, manager_profile__teamlead=user)
                queryset = Assessor.objects.filter(manager__in=team)
            else:
                queryset = Assessor.objects.filter(Q(manager=user) | Q(second_manager__in=[user]))

        return (queryset.select_related('manager')
                .prefetch_related('projects__manager', 'second_manager')
                .order_by('manager__last_name', 'last_name')
                .distinct())

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = serializers.AssessorSerializer(assessor)
        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, **kwargs) -> Response:
        return self._update(request, **kwargs)

    @action(detail=True, methods=['patch'])
    def projects(self, request: Request, **kwargs) -> Response:
        return self._update(request, **kwargs)

    @action(detail=True, methods=['patch'])
    def skills(self, request: Request, **kwargs) -> Response:
        return self._update(request, **kwargs)

    @action(detail=True, methods=['patch'])
    def vacation(self, request: Request, **kwargs) -> Response:
        return self._update(request, **kwargs)

    @action(detail=True, methods=['patch'])
    def free_resource(self, request: Request, **kwargs) -> Response:
        return self._update(request, **kwargs)

    @action(detail=True, methods=['patch'])
    def unpin(self, request: Request, **kwargs) -> Response:
        return self._update(request, **kwargs)

    @action(detail=True, methods=['patch'])
    def fire(self, request: Request, **kwargs) -> Response:
        return self._update(request, **kwargs)

    def _update(self, request: Request, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = serializers.AssessorSerializer(assessor)
        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='get', decorator=schemas.check_assessor_schema.get())
class AssessorCheckAPIView(generics.ListAPIView):
    queryset = Assessor.objects.all().select_related('manager')
    serializer_class = serializers.CheckAssessorSerializer
    permission_classes = (IsAuthenticated,)
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name',
        'status',
        'projects'
    ]

    def filter_queryset(self, queryset: QuerySet[Assessor]) -> QuerySet[Assessor]:
        full_name = self.request.GET.get('full_name')
        username = self.request.GET.get('username')
        if full_name is None and username is None:
            raise ValidationError(
                {'detail': ['Укажите ФИО или username исполнителя.']}
            )

        if full_name:
            queryset = queryset.annotate(
                search=SearchVector('last_name') + SearchVector('first_name') + SearchVector('middle_name')
            ).filter(search=full_name)

        if username:
            queryset = queryset.filter(username__iexact=username)

        return queryset


@method_decorator(name='retrieve', decorator=schemas.credentials_schema.retrieve())
@method_decorator(name='list', decorator=schemas.credentials_schema.list())
@method_decorator(name='create', decorator=schemas.credentials_schema.create())
@method_decorator(name='partial_update', decorator=schemas.credentials_schema.partial_update())
@method_decorator(name='destroy', decorator=schemas.credentials_schema.destroy())
class AssessorCredentialsAPIViewSet(BaseAPIViewSet):
    queryset = AssessorCredentials.objects.all().select_related('assessor')
    serializer_class = {
        'retrieve': serializers.AssessorCredentialsSerializer,
        'list': serializers.AssessorCredentialsSerializer,
        'create': serializers.CreateUpdateAssessorCredentialsSerializer,
        'partial_update': serializers.CreateUpdateAssessorCredentialsSerializer
    }
    permission_classes = {
        'retrieve': (IsAuthenticated, permissions.IsManager),
        'list': (IsAuthenticated, permissions.IsManager),
        'create': (IsAuthenticated, permissions.IsManager),
        'partial_update': (IsAuthenticated, permissions.IsManager),
        'destroy': (IsAuthenticated, permissions.IsManager)
    }
    filterset_class = filters.AssessorCredentialsFilter
    ordering_fields = ['pk', 'assessor']

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        credentials = serializer.save()
        response = serializers.AssessorCredentialsSerializer(credentials)
        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = serializers.AssessorCredentialsSerializer(assessor)
        return Response(response.data, status=status.HTTP_200_OK)

    def destroy(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        manager = self.request.user
        permissions.check_full_assessor_permission(manager, instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(name='retrieve', decorator=schemas.fr_schema.retrieve())
@method_decorator(name='list', decorator=schemas.fr_schema.list())
@method_decorator(name='partial_update', decorator=schemas.fr_schema.partial_update())
class FreeResourcesAPIViewSet(BaseAPIViewSet):
    permission_classes = {
        'retrieve': (IsAuthenticated, permissions.IsManager),
        'list': (IsAuthenticated, permissions.IsManager),
        'partial_update': (IsAuthenticated, permissions.IsManager)
    }
    serializer_class = {
        'retrieve': serializers.AssessorSerializer,
        'list': serializers.AssessorSerializer,
        'partial_update': serializers.UpdateFreeResourceSerializer
    }
    http_method_names = ['get', 'patch']
    filterset_class = filters.FreeResourcesFilter
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name'
    ]

    def get_queryset(self) -> QuerySet[Assessor]:
        return (Assessor.objects
                .exclude(state__in=AssessorState.fired_states())
                .filter(Q(state=AssessorState.FREE_RESOURCE) | Q(manager=None))
                .select_related('manager')
                .prefetch_related('projects')
                .order_by('last_name'))

    def update(self, request: Request, *args, **kwargs) -> Response:
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        response = serializers.AssessorSerializer(obj)
        return Response(response.data)
