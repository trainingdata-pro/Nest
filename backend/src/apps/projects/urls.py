from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('', api.ProjectAPIViewSet, basename='project')

urlpatterns = [
    path('projects/', include(router.urls)),
    path('projects/<int:pk>/assessors/', api.GetAllAssessorForProject.as_view()),
    path('tags/', api.TagsApiView.as_view())
]
