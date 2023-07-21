from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('', api.AssessorAPIViewSet, basename='assessor')
router.register('', api.AssessorProjectsAPIViewSet, basename='assessor-project')

fr_router = routers.DefaultRouter()
fr_router.register('', api.FreeResourcesAPIViewSet, basename='free-resources')

urlpatterns = [
    path('assessors/check/', api.AssessorCheckAPIView.as_view()),
    path('assessors/', include(router.urls)),
    path('free_resources/', include(fr_router.urls))
]
