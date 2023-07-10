from django.urls import path, include
from rest_framework import routers

from .api import AssessorAPIViewSet, AssessorProjectsAPIViewSet, AssessorCheckAPIView

router = routers.DefaultRouter()
router.register('', AssessorAPIViewSet, basename='assessor')
router.register('', AssessorProjectsAPIViewSet, basename='assessor-project')

urlpatterns = [
    path('assessors/check/', AssessorCheckAPIView.as_view()),
    path('assessors/', include(router.urls))
]
