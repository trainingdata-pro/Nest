from django.utils.decorators import method_decorator
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

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
class FiredAPIViewSet(viewsets.ModelViewSet):
    queryset = Fired.objects.all().select_related('assessor', 'reason')
    serializer_class = serializers.FiredSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get']


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
