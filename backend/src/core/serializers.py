from typing import Dict

from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import Token, RefreshToken

USER_DATA_FIELD = 'user_data'

DEFAULT_ERROR_MESSAGES = {
    'no_active_account': 'Неверный логин или пароль.',
    'user_not_active': 'Пользователь не активен.',
    'user_not_found': 'Пользователь не найден.'
}


def _update_user_payload(user) -> Dict:
    payload = {
        'email': user.email,
        'username': user.username,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'status': user.status,
        'is_admin': user.is_superuser
    }

    if hasattr(user, 'manager_profile'):
        payload['is_teamlead'] = user.manager_profile.is_teamlead
        if user.manager_profile.teamlead:
            payload['teamlead'] = user.manager_profile.teamlead.id
        else:
            payload['teamlead'] = None

    return payload


def get_updated_payload(user=None, refresh_token: RefreshToken = None) -> Dict:
    if user is not None:
        payload = _update_user_payload(user)
    else:
        user_id = refresh_token.payload.get(api_settings.USER_ID_CLAIM)
        user_model = get_user_model()
        user = user_model.objects.filter(id=user_id).first()
        if user is None:
            raise exceptions.AuthenticationFailed(
                DEFAULT_ERROR_MESSAGES['user_not_found'],
                'no_active_account',
            )
        else:
            if not user.is_active:
                raise exceptions.AuthenticationFailed(
                    DEFAULT_ERROR_MESSAGES['user_not_active'],
                    'no_active_account',
                )

            payload = _update_user_payload(user)

    return payload


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = DEFAULT_ERROR_MESSAGES

    def check_is_active(self, attrs: Dict) -> None:
        email = attrs.get(self.username_field)
        user_model = get_user_model()
        user = user_model.objects.filter(email=email, is_active=False).first()
        if user is not None:
            raise exceptions.AuthenticationFailed(
                self.default_error_messages['user_not_active'],
                'no_active_account',
            )

    def validate(self, attrs: Dict) -> Dict:
        self.check_is_active(attrs)
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)
        token[USER_DATA_FIELD] = get_updated_payload(user=user)
        return token


class CustomRefreshTokenSerializer(TokenRefreshSerializer):
    def validate(self, attrs: Dict) -> Dict:
        refresh = self.token_class(attrs['refresh'])
        refresh.payload[USER_DATA_FIELD] = get_updated_payload(refresh_token=refresh)
        data = {'access': str(refresh.access_token)}

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    refresh.blacklist()
                except AttributeError:
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            data['refresh'] = str(refresh)

        return data
