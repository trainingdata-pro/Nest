from django.urls import path, include
from rest_framework import routers

from . import api

users_router = routers.DefaultRouter()
users_router.register('', api.UserAPIViewSet, basename='users')

profiles_router = routers.DefaultRouter()
profiles_router.register('', api.ManagerAPIViewSet, basename='manager-profiles')


urlpatterns = [
    path('users/', include(users_router.urls)),
    path('managers/', include(profiles_router.urls))
]
