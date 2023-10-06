from django.urls import path

from . import views


urlpatterns = [
    path('swagger/login/', views.Login.as_view(), name='swagger-login'),
    path('swagger/logout/', views.Logout.as_view(), name='swagger-logout'),
]
