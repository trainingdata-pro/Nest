from typing import Dict

from drf_yasg import openapi

from core.schemas import BaseAPISchema

from . import serializers


class ExportSchema(BaseAPISchema):
    def status(self):
        return self.swagger_auto_schema(
            operation_summary='Check report status',
            operation_description='Returns the report generation status and, '
                                  'if successful, the name of the result file.\n\n'
                                  'Available statuses:\n'
                                  'SUCCESS - the report was generated successfully\n'
                                  'PENDING - the report generation in process\n'
                                  'FAILURE - the report generation error',
            manual_parameters=[
                openapi.Parameter(
                    name='task_id',
                    in_=openapi.IN_PATH,
                    type=openapi.TYPE_STRING,
                    required=True
                )
            ],
            responses={
                200: serializers.DownloadStatusSerializer(),
                **self.get_responses(401)
            },
        )

    def download(self):
        return self.swagger_auto_schema(
            operation_summary='Download file',
            operation_description='Download a specific report.',
            manual_parameters=[
                openapi.Parameter(
                    name='filename',
                    in_=openapi.IN_PATH,
                    type=openapi.TYPE_STRING,
                    required=True
                )
            ],
            responses={
                200: openapi.Response(
                    description='Download of file started',
                    content={
                        'application/octet-stream': openapi.Schema(
                            type='string',
                            format='binary'
                        )
                    },
                ),
                **self.get_responses(401, 404)
            }
        )

    @staticmethod
    def get_404() -> Dict:
        return {
            404: 'File not found'
        }


export_schema = ExportSchema(tags=['export'])
