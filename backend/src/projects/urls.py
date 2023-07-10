from django.urls import path, include
from rest_framework import routers

from .api import ProjectAPIViewSet

router = routers.DefaultRouter()
router.register('', ProjectAPIViewSet, basename='project')

urlpatterns = [
    path('projects/', include(router.urls))
]
