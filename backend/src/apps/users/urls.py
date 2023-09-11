from django.urls import path, include
from rest_framework import routers

from . import api

users_router = routers.DefaultRouter()
users_router.register('', api.UserAPIViewSet, basename='users')

profiles_router = routers.DefaultRouter()
profiles_router.register('', api.ManagerAPIViewSet, basename='manager-profiles')

_password = [
    path('reset/', api.ResetPasswordAPIView.as_view()),
    path('set/', api.PasswordSetAPIView.as_view()),
    path('<int:pk>/change/', api.ChangePasswordAPIView.as_view())
]

urlpatterns = [
    path('users/', include(users_router.urls)),
    path('managers/', include(profiles_router.urls)),
    path('activate_user/', api.UserActivateAPIView.as_view(), name='activate'),
    path('password/', include(_password))
]
