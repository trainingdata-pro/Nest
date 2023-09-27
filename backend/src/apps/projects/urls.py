from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('projects', api.ProjectAPIViewSet, basename='project')
router.register('working_hours', api.ProjectWorkingHoursAPIViewSet, basename='project-working-hours')
router.register('workload_status', api.WorkLoadStatusAPIViewSet, basename='workload-status')

urlpatterns = [
    path('', include(router.urls)),
    path('projects/<int:pk>/assessors/', api.GetAllAssessorForProject.as_view()),
    path('tags/', api.TagsApiView.as_view())
]
