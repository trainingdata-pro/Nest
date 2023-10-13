from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('skills', api.SkillsAPIViewSet, basename='skills')
router.register('assessors', api.AssessorAPIViewSet, basename='assessor')
router.register('credentials', api.AssessorCredentialsAPIViewSet, basename='credentials')
router.register('free_resources', api.FreeResourcesAPIViewSet, basename='f-resource')

urlpatterns = [
    path('assessors/check/', api.AssessorCheckAPIView.as_view()),
    path('', include(router.urls))
]
