from django.db.models import Q
from django.utils.decorators import method_decorator
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.utils.common import BaseAPIViewSet
from core.utils import permissions
from apps.fired.serializers import BlackListAssessorSerializer, FireAssessorSerializer
from apps.users.models import Manager
from .filters import AssessorFilter, SkillsFilter
from .models import (Assessor,
                     Skill,
                     WorkingHours)
from .schemas import (assessor_schema,
                      check_assessor_schema,
                      fr_schema,
                      skills_schema,
                      wh_schema)
from . import serializers


@method_decorator(name='retrieve', decorator=skills_schema.retrieve())
@method_decorator(name='list', decorator=skills_schema.list())
class SkillsAPIViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('title')
    serializer_class = serializers.SkillSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']
    filterset_class = SkillsFilter
    ordering_fields = ['pk', 'title']


@method_decorator(name='retrieve', decorator=assessor_schema.retrieve())
@method_decorator(name='list', decorator=assessor_schema.list())
@method_decorator(name='create', decorator=assessor_schema.create())
@method_decorator(name='partial_update', decorator=assessor_schema.partial_update())
@method_decorator(name='blacklist', decorator=assessor_schema.blacklist())
@method_decorator(name='fire', decorator=assessor_schema.fire())
class AssessorAPIViewSet(BaseAPIViewSet):
    permission_classes = {
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'create': (IsAuthenticated, permissions.IsManager),
        'partial_update': (IsAuthenticated, permissions.IsManager, permissions.AssessorPermission),
        'blacklist': (IsAuthenticated, permissions.IsManager, permissions.AssessorPermission),
        'fire': (IsAuthenticated, permissions.IsManager, permissions.AssessorPermission)
    }
    serializer_class = {
        'list': serializers.AssessorSerializer,
        'retrieve': serializers.AssessorSerializer,
        'create': serializers.CreateUpdateAssessorSerializer,
        'partial_update': serializers.CreateUpdateAssessorSerializer,
        'blacklist': BlackListAssessorSerializer,
        'fire': FireAssessorSerializer
    }
    http_method_names = ['get', 'post', 'patch']
    filterset_class = AssessorFilter
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name',
        'status'
    ]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return (Assessor.objects.all()
                    .select_related('manager__user')
                    .prefetch_related('projects__manager', 'second_manager')
                    .order_by('manager__last_name', 'last_name')
                    .distinct())
        else:
            manager = user.manager
            if manager.is_operational_manager:
                team = Manager.objects.filter(operational_manager=manager)
                return (Assessor.objects
                        .filter(manager__in=team)
                        .select_related('manager__user')
                        .prefetch_related('projects__manager', 'second_manager')
                        .order_by('manager__last_name', 'last_name')
                        .distinct())

            return (Assessor.objects
                    .filter(Q(manager=manager) | Q(second_manager__in=[manager]))
                    .select_related('manager__user')
                    .prefetch_related('projects__manager', 'second_manager')
                    .order_by('last_name')
                    .distinct())

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = serializers.AssessorSerializer(assessor)

        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
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

    def _fire(self, request, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            data=request.data,
            context={'assessor': instance}
        )
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = serializers.AssessorSerializer(assessor)

        return Response(response.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def blacklist(self, request, **kwargs):
        return self._fire(request, **kwargs)

    @action(detail=True, methods=['patch'])
    def fire(self, request, **kwargs):
        return self._fire(request, **kwargs)


@method_decorator(name='get', decorator=check_assessor_schema.get())
class AssessorCheckAPIView(generics.ListAPIView):
    queryset = Assessor.objects.all().select_related('manager__user')
    serializer_class = serializers.CheckAssessorSerializer
    permission_classes = (IsAuthenticated,)

    def __check_request(self):
        last_name = self.request.GET.get('last_name')
        first_name = self.request.GET.get('first_name')
        middle_name = self.request.GET.get('middle_name')
        if not all([last_name, first_name, middle_name]):
            raise ValidationError(
                {'detail': ['You have to specify last_name, first_name and middle_name.']}
            )
        return {
            'last_name': last_name,
            'first_name': first_name,
            'middle_name': middle_name
        }

    def filter_queryset(self, queryset):
        data = self.__check_request()
        last_name = data.get('last_name')
        first_name = data.get('first_name')
        middle_name = data.get('middle_name')

        return queryset.filter(Q(last_name__iexact=last_name) &
                               Q(first_name__iexact=first_name) &
                               Q(middle_name__iexact=middle_name))


@method_decorator(name='retrieve', decorator=wh_schema.retrieve())
@method_decorator(name='list', decorator=wh_schema.list())
@method_decorator(name='create', decorator=wh_schema.create())
@method_decorator(name='partial_update', decorator=wh_schema.partial_update())
class WorkingHoursAPIViewSet(BaseAPIViewSet):
    queryset = WorkingHours.objects.all()
    permission_classes = {
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'create': (IsAuthenticated, permissions.IsManager),
        'partial_update': (IsAuthenticated, permissions.IsManager),
        'destroy': (IsAuthenticated, permissions.IsManager)
    }
    serializer_class = {
        'retrieve': serializers.WorkingHoursSerializer,
        'list': serializers.WorkingHoursSerializer,
        'create': serializers.CreateUpdateWorkingHoursSerializer,
        'partial_update': serializers.CreateUpdateWorkingHoursSerializer
    }
    http_method_names = ['get', 'post', 'patch']  # delete

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        wh = serializer.save()
        response = serializers.WorkingHoursSerializer(wh)

        return Response(response.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        wh = serializer.save()
        response = serializers.WorkingHoursSerializer(wh)

        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='retrieve', decorator=fr_schema.retrieve())
@method_decorator(name='list', decorator=fr_schema.list())
@method_decorator(name='partial_update', decorator=fr_schema.partial_update())
class FreeResourcesAPIViewSet(BaseAPIViewSet):
    permission_classes = {
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'partial_update': (IsAuthenticated, permissions.IsManager)
    }
    serializer_class = {
        'retrieve': serializers.AssessorSerializer,
        'list': serializers.AssessorSerializer,
        'partial_update': serializers.UpdateFreeResourceSerializer
    }
    http_method_names = ['get', 'patch']
    ordering_fields = [
        'pk',
        'username',
        'last_name',
        'manager__last_name'
    ]

    def get_queryset(self):
        queryset = (Assessor.objects
                    .filter(Q(is_free_resource=True) | Q(manager=None))
                    .select_related('manager')
                    .prefetch_related('projects')
                    .order_by('manager__last_name'))

        return queryset

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        response = serializers.AssessorSerializer(obj)

        return Response(response.data)
