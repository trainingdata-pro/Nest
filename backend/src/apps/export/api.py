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
from .services import ContentType


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
        content_type = ContentType.get_content_type(filename)
        return self._get_response(content_type, filename)

    def _get_response(self, content_type: str, filename: str) -> Union[FileResponse, Response]:
        path_to_file = os.path.join(settings.MEDIA_ROOT, filename)
        if self._check_if_file_exists(path_to_file):
            # def file_iterator(path: str, chunk_size: int = 4096):
            #     with open(path, 'rb') as file:
            #         while True:
            #             data = file.read(chunk_size)
            #             if not data:
            #                 break
            #             yield data

            response = FileResponse(
                # file_iterator(path_to_file),
                open(path_to_file, 'rb'),
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
