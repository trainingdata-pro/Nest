from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('blacklist', api.BlackListAPIViewSet, basename='blacklist')
router.register('fired', api.FiredAPIViewSet, basename='fired')
router.register('reasons', api.ReasonAPIViewSet, basename='reason')

_export = [
    path('blacklist/', api.ExportBlackListAPIView.as_view()),
]

urlpatterns = [
    path('', include(router.urls)),
    path('export/', include(_export))
]
