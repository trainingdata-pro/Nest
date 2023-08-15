from django.urls import path, include
from rest_framework import routers

from .api import ProjectAPIViewSet, GetAllAssessorForProject

router = routers.DefaultRouter()
router.register('', ProjectAPIViewSet, basename='project')

urlpatterns = [
    path('projects/', include(router.urls)),
    path('projects/<int:pk>/assessors/', GetAllAssessorForProject.as_view())
]
