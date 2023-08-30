from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('', api.ManagerAPIViewSet, basename='user')

_password = [
    path('reset/', api.ResetPasswordAPIView.as_view()),
    path('set/', api.PasswordSetAPIView.as_view())
]

urlpatterns = [
    path('users/', include(router.urls)),
    path('base_user/<int:pk>/', api.UpdateUsernameAPIView.as_view(), name='update_username'),
    path('activate_user/', api.UserActivateAPIView.as_view(), name='activate'),
    path('password/', include(_password))
]
