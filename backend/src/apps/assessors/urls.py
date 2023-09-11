from django.urls import path, include
from rest_framework import routers

from . import api

skills_router = routers.DefaultRouter()
skills_router.register('', api.SkillsAPIViewSet, basename='skills')

assessors_router = routers.DefaultRouter()
assessors_router.register('', api.AssessorAPIViewSet, basename='assessor')

credential_router = routers.DefaultRouter()
credential_router.register('', api.AssessorCredentialsAPIViewSet, basename='credentials')

# wh_router = routers.DefaultRouter()
# wh_router.register('', api.WorkingHoursAPIViewSet, basename='working-hours')

fr_router = routers.DefaultRouter()
fr_router.register('', api.FreeResourcesAPIViewSet, basename='fr-get')

urlpatterns = [
    path('assessors/check/', api.AssessorCheckAPIView.as_view()),
    path('skills/', include(skills_router.urls)),
    path('assessors/', include(assessors_router.urls)),
    path('credentials/', include(credential_router.urls)),
    path('free_resources/', include(fr_router.urls))
]
