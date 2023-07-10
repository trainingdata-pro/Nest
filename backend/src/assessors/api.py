from django.utils.decorators import method_decorator
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from core.permissions import AssessorOwner
from core.utils import BaseAPIViewSet
from rest_framework.response import Response

from .filters import AssessorFilter
from .models import Assessor
from .schemas import (assessor_schema,
                      projects_schema,
                      check_assessor_schema)
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
        'list': serializers.AssessorSerializer
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
        return (Assessor.objects.filter(manager=self.request.user.manager)
                .select_related('manager__user')
                .prefetch_related('projects'))

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
    permission_classes = (IsAuthenticated, AssessorOwner)
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

