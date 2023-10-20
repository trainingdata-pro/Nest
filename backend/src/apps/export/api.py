import os
from typing import Union

from celery.result import AsyncResult
from django.conf import settings
from django.db.models.query import EmptyQuerySet
from django.http import FileResponse
from django.utils.decorators import method_decorator
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from . import schemas, serializers
from .services import ExportType


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
        return Response(response.data)


@method_decorator(name='get', decorator=schemas.export_schema.download())
class DownloadReportAPIView(generics.GenericAPIView):
    queryset = EmptyQuerySet
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ExportSerializer

    def get(self, request: Request, **kwargs):
        filename = kwargs.get('filename')
        return self._get_response(filename)

    def _get_response(self, filename: str) -> Union[FileResponse, Response]:
        path_to_file = os.path.join(settings.MEDIA_ROOT, filename)
        if self._check_if_file_exists(path_to_file):
            response = FileResponse(
                open(path_to_file, 'rb'),
                as_attachment=True
            )
            return response
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def _check_if_file_exists(path) -> bool:
        return os.path.exists(path)
