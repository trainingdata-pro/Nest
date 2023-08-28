from django.urls import path

from .api import HistoryAPIView

urlpatterns = [
    path('history/', HistoryAPIView.as_view())
]
