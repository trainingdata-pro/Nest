from django.db.models.query import EmptyQuerySet
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.assessors.serializers import AssessorSerializer
from apps.export.serializers import ExportSerializer
from apps.export.services import ContentType
from core.mixins import BaseAPIViewSet
from core.permissions import IsManager
from .filters import ReasonFilter, FiredFilter, BlackListFilter
from .models import BlackList, Fired, Reason
from .tasks import make_report
from . import schemas, serializers


@method_decorator(name='retrieve', decorator=schemas.reason_schema.retrieve())
@method_decorator(name='list', decorator=schemas.reason_schema.list())
class ReasonAPIViewSet(viewsets.ModelViewSet):
    queryset = Reason.objects.all()
    serializer_class = serializers.ReasonSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']
    filterset_class = ReasonFilter
    ordering_fields = ['pk', 'title', 'blacklist_reason']


@method_decorator(name='retrieve', decorator=schemas.fired_schema.retrieve_blacklist())
@method_decorator(name='list', decorator=schemas.fired_schema.list_blacklist())
class BlackListAPIViewSet(viewsets.ModelViewSet):
    queryset = BlackList.objects.all().select_related('assessor', 'reason')
    serializer_class = serializers.BlackListSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']
    filterset_class = BlackListFilter
    ordering_fields = ['pk']


@method_decorator(name='retrieve', decorator=schemas.fired_schema.retrieve_fired())
@method_decorator(name='list', decorator=schemas.fired_schema.list_fired())
@method_decorator(name='back', decorator=schemas.fired_schema.back())
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
    filterset_class = FiredFilter
    ordering_fields = ['pk']

    @action(detail=True, methods=['patch'])
    def back(self, request: Request, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        assessor = serializer.save()
        response = AssessorSerializer(assessor)
        return Response(response.data, status=status.HTTP_200_OK)


@method_decorator(name='get', decorator=schemas.export_schema.export())
class ExportBlackListAPIView(generics.GenericAPIView):
    queryset = EmptyQuerySet
    permission_classes = (IsAuthenticated,)
    serializer_class = ExportSerializer

    def get(self, request: Request, *args, **kwargs) -> Response:
        export_type = request.GET.get('type', '').lower()
        ContentType.validate(export_type)
        items = request.GET.get('items')
        task = make_report.delay(export_type=export_type, items=items)
        return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)
