from django.urls import path, include
from rest_framework import routers

from .api import ManagerAPIViewSet, UserActivateAPIView

router = routers.DefaultRouter()
router.register('', ManagerAPIViewSet, basename='user')

urlpatterns = [
    path('users/', include(router.urls)),
    path('activate_user/', UserActivateAPIView.as_view(), name='activate')
]
