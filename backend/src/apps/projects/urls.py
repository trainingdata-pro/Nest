from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('', api.ProjectAPIViewSet, basename='project')

project_wh_router = routers.DefaultRouter()
project_wh_router.register('', api.ProjectWorkingHoursAPIViewSet, basename='project-working-hours')

urlpatterns = [
    path('projects/', include(router.urls)),
    path('projects/<int:pk>/assessors/', api.GetAllAssessorForProject.as_view()),
    path('working_hours/', include(project_wh_router.urls)),
    path('tags/', api.TagsApiView.as_view())
]
