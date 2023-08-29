from django.utils.decorators import method_decorator
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.assessors.serializers import AssessorSerializer
from core.utils.common import BaseAPIViewSet
from core.utils.permissions import IsManager
from .models import BlackList, Fired, BlackListReason, FiredReason
from .schemas import fired_schema
from . import serializers


@method_decorator(name='retrieve', decorator=fired_schema.retrieve_blacklist())
@method_decorator(name='list', decorator=fired_schema.list_blacklist())
class BlackListAPIViewSet(viewsets.ModelViewSet):
    queryset = BlackList.objects.all().select_related('assessor', 'reason')
    serializer_class = serializers.BlackListSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']


@method_decorator(name='retrieve', decorator=fired_schema.retrieve_fired())
@method_decorator(name='list', decorator=fired_schema.list_fired())
@method_decorator(name='back', decorator=fired_schema.back())
class FiredAPIViewSet(BaseAPIViewSet):
    queryset = Fired.objects.all().select_related('assessor', 'reason')
    serializer_class = {
        'retrieve': serializers.FiredSerializer,
        'list': serializers.FiredSerializer,
        'back': serializers.BackToTeamSerializer
    }
    permission_classes = {
        'retrieve': (IsAuthenticated,),
        'list': (IsAuthenticated,),
        'back': (IsAuthenticated, IsManager)

    }
    http_method_names = ['get', 'patch']

    @action(detail=True, methods=['patch'])
    def back(self, request, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = AssessorSerializer(assessor)

        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='retrieve', decorator=fired_schema.retrieve_fired_reason())
@method_decorator(name='list', decorator=fired_schema.list_fired_reason())
class FiredReasonAPIViewSet(viewsets.ModelViewSet):
    queryset = FiredReason.objects.all()
    serializer_class = serializers.FiredReasonSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']


@method_decorator(name='retrieve', decorator=fired_schema.retrieve_bl_reason())
@method_decorator(name='list', decorator=fired_schema.list_bl_reason())
class BlackListReasonAPIViewSet(viewsets.ModelViewSet):
    queryset = BlackListReason.objects.all()
    serializer_class = serializers.BlackListReasonSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']
