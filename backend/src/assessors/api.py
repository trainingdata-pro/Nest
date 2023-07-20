from django.db.models import Count, F, Q
from django.utils.decorators import method_decorator
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated

from core.permissions import AssessorOwner, OwnerOrSecondManager
from core.utils import BaseAPIViewSet, GetSerializerClassMixin
from rest_framework.response import Response

from .filters import AssessorFilter
from .models import Assessor
from .schemas import (assessor_schema,
                      projects_schema,
                      check_assessor_schema,
                      fr_schema)
from . import serializers


@method_decorator(name='retrieve', decorator=assessor_schema.retrieve())
@method_decorator(name='list', decorator=assessor_schema.list())
@method_decorator(name='create', decorator=assessor_schema.create())
@method_decorator(name='partial_update', decorator=assessor_schema.partial_update())
@method_decorator(name='destroy', decorator=assessor_schema.destroy())
class AssessorAPIViewSet(BaseAPIViewSet):
    permission_classes = {
        'create': (IsAuthenticated,),
        'partial_update': (IsAuthenticated, AssessorOwner),
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'destroy': (IsAuthenticated, AssessorOwner),
    }
    serializer_class = {
        'create': serializers.CreateAssessorSerializer,
        'partial_update': serializers.CreateAssessorSerializer,
        'retrieve': serializers.AssessorSerializer,
        'list': serializers.AssessorSerializer,
        'destroy': serializers.RemoveAssessorSerializer
    }
    http_method_names = ['get', 'post', 'patch', 'delete']
    filterset_class = AssessorFilter
    ordering_fields = [
        'username',
        'last_name',
        'first_name',
        'middle_name',
        'is_busy'
    ]

    def get_queryset(self):
        manager = self.request.user.manager
        return (Assessor.objects
                .filter(Q(manager=manager) | Q(second_manager__in=[manager]))
                .select_related('manager__user')
                .prefetch_related('projects__owner', 'second_manager')
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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(name='get', decorator=check_assessor_schema.get())
class AssessorCheckAPIView(generics.ListAPIView):
    queryset = Assessor.objects.all().select_related('manager__user')
    serializer_class = serializers.CheckAssessorSerializer
    permission_classes = (IsAuthenticated,)

    def check_request(self):
        last_name = self.request.GET.get('last_name')
        first_name = self.request.GET.get('first_name')
        middle_name = self.request.GET.get('middle_name')
        if not all([last_name, first_name, middle_name]):
            raise ValidationError(
                {'detail': 'You have to specify last_name, first_name and middle_name.'}
            )
        return {
            'last_name': last_name,
            'first_name': first_name,
            'middle_name': middle_name
        }

    def filter_queryset(self, queryset):
        data = self.check_request()
        last_name = data.get('last_name')
        first_name = data.get('first_name')
        middle_name = data.get('middle_name')

        return queryset.filter(
            last_name__iexact=last_name,
            first_name__iexact=first_name,
            middle_name__iexact=middle_name
        )


class AssessorProjectsAPIViewSet(viewsets.ModelViewSet):
    queryset = Assessor.objects.all()
    serializer_class = {
        'add_project': serializers.AddAssessorProjectSerializer,
        'delete_project': serializers.RemoveAssessorProjectSerializer
    }
    permission_classes = (IsAuthenticated, OwnerOrSecondManager)
    http_method_names = ['patch']

    def get_serializer_class(self):
        return self.serializer_class[self.action]

    @projects_schema.add_project()
    @action(detail=True, methods=['patch'])
    def add_project(self, request, **kwargs):
        assessor = self.get_object()
        serializer = self.get_serializer(assessor, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_assessor = serializer.save()
        response = serializers.AssessorSerializer(updated_assessor)

        return Response(response.data, status=status.HTTP_200_OK)

    @projects_schema.delete_project()
    @action(detail=True, methods=['patch'])
    def delete_project(self, request, **kwargs):
        assessor = self.get_object()
        serializer = self.get_serializer(assessor, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_assessor = serializer.save()
        response = serializers.AssessorSerializer(updated_assessor)

        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='list', decorator=fr_schema.list())
class FreeResourcesAPIViewSet(GetSerializerClassMixin,
                              ListModelMixin,
                              # UpdateModelMixin,
                              viewsets.GenericViewSet):
    queryset = Assessor.objects.all()
    serializer_class = {
        'list': serializers.AssessorSerializer,
        'check_as_free': serializers.CheckAsFreeResourceSerializer,
        'uncheck_as_free': serializers.UncheckAsFreeResourceSerializer,
        'take': serializers.TakeFreeResourceSerializer,
        'cancel': serializers.CancelFreeResourceSerializer,
        'add_to_team': serializers.AddToTeamSerializer
    }
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get', 'patch']

    def filter_free_resources(self, queryset):
        manager = self.request.user.manager
        return (queryset.filter(is_free_resource=True)
                .annotate(managers=Count('second_manager', distinct=True))
                .filter(managers__lt=F('max_count_of_second_managers'))
                .exclude(second_manager__in=[manager])
                .select_related('manager')
                .prefetch_related('projects')
                .annotate(project_count=Count('projects', distinct=True))
                .order_by('project_count', 'manager__last_name'))

    def list(self, request, *args, **kwargs):
        queryset = self.filter_free_resources(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @fr_schema.check_as_free()
    @action(detail=False, methods=['patch'])
    def check_as_free(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fr = serializer.save()
        response = serializers.AssessorSerializer(fr, many=True)

        return Response(response.data, status=status.HTTP_200_OK)

    @fr_schema.uncheck_as_free()
    @action(detail=False, methods=['patch'])
    def uncheck_as_free(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fr = serializer.save()
        response = serializers.AssessorSerializer(fr, many=True)

        return Response(response.data, status=status.HTTP_200_OK)

    def update(self, request, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = serializers.AssessorSerializer(instance)

        return Response(response.data)

    @fr_schema.take()
    @action(detail=True, methods=['patch'])
    def take(self, request, **kwargs):
        return self.update(request, **kwargs)

    @fr_schema.cancel()
    @action(detail=True, methods=['patch'])
    def cancel(self, request, **kwargs):
        return self.update(request, **kwargs)

    @fr_schema.add_to_team()
    @action(detail=True, methods=['patch'])
    def add_to_team(self, request, **kwargs):
        return self.update(request, **kwargs)
