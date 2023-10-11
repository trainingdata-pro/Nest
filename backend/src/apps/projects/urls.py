from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('projects', api.ProjectAPIViewSet, basename='project')
router.register('working_hours', api.ProjectWorkingHoursAPIViewSet, basename='project-working-hours')
router.register('workload_status', api.WorkLoadStatusAPIViewSet, basename='workload-status')

_export = [
    path('projects/', api.ExportProjectsAPIView.as_view()),
]

urlpatterns = [
    path('', include(router.urls)),
    path('export/', include(_export)),
    path('projects/<int:pk>/assessors/', api.GetAllAssessorForProject.as_view()),
    path('tags/', api.TagsApiView.as_view()),
]
