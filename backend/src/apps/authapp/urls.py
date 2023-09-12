from django.urls import path, include

from . import api

_password = [
    path('reset/', api.ResetPasswordAPIView.as_view()),
    path('set/', api.PasswordSetAPIView.as_view()),
    path('<int:pk>/change/', api.ChangePasswordAPIView.as_view())
]

_token = [
    path('', api.TokenObtainPairAPIView.as_view(), name='token_obtain_pair'),
    path('refresh/', api.TokenRefreshAPIView.as_view(), name='token_refresh'),
]

urlpatterns = [
    path('password/', include(_password)),
    path('token/', include(_token)),
    path('activate_user/', api.UserActivateAPIView.as_view(), name='activate')
]
