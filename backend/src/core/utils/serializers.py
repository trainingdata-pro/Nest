from typing import Dict

from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Неверный логин или пароль.',
        'user_not_active': 'Пользователь не активен.'
    }

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
        token['user_data'] = {
            'email': user.email,
            'username': user.username,
            'status': user.status,
            'is_active': user.is_active,
            'is_admin': user.is_superuser
        }
        if hasattr(user, 'manager_profile'):
            token['user_data']['is_teamlead'] = user.manager_profile.is_teamlead
            if user.manager_profile.teamlead:
                token['user_data']['teamlead'] = user.manager_profile.teamlead.id
            else:
                token['user_data']['teamlead'] = None

        return token
