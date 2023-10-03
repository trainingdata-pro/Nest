from django.utils.decorators import method_decorator
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.assessors.serializers import AssessorSerializer
from core.mixins import BaseAPIViewSet
from core.permissions import IsManager
from .filters import ReasonFilter
from .models import BlackList, Fired, Reason
from .schemas import reason_schema, fired_schema
from . import serializers


@method_decorator(name='retrieve', decorator=reason_schema.retrieve())
@method_decorator(name='list', decorator=reason_schema.list())
class ReasonAPIViewSet(viewsets.ModelViewSet):
    queryset = Reason.objects.all()
    serializer_class = serializers.ReasonSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']
    filterset_class = ReasonFilter
    ordering_fields = ['pk', 'title', 'blacklist_reason']


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
    def back(self, request: Request, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = AssessorSerializer(assessor)

        return Response(response.data, status=status.HTTP_200_OK)
