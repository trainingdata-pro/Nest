from django.urls import path

from . import api

urlpatterns = [
    path('export/status/<str:task_id>/', api.GetExportResultAPIView.as_view()),
    path('export/download/<str:filename>/', api.DownloadReportAPIView.as_view())
]
