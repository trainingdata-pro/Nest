from django.urls import path, include
from rest_framework import routers

from . import api

blacklist_router = routers.DefaultRouter()
blacklist_router.register('', api.BlackListAPIViewSet, basename='blacklist')

fired_router = routers.DefaultRouter()
fired_router.register('', api.FiredAPIViewSet, basename='fired')

reasons_router = routers.DefaultRouter()
reasons_router.register('blacklist', api.BlackListReasonAPIViewSet, basename='bl-reason')
reasons_router.register('fired', api.FiredReasonAPIViewSet, basename='fire-reason')

urlpatterns = [
    path('blacklist/', include(blacklist_router.urls)),
    path('fired/', include(fired_router.urls)),
    path('reasons/', include(reasons_router.urls))
]
