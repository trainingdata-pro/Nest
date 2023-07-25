from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('', api.ManagerAPIViewSet, basename='user')

urlpatterns = [
    path('users/', include(router.urls)),
    path('activate_user/', api.UserActivateAPIView.as_view(), name='activate')
]
