from django.contrib.auth.models import User
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Неверный логин или пароль.',
        'user_not_active': 'Пользователь не активен.'
    }

    def check_is_active(self, attrs):
        username = attrs.get(self.username_field)
        user = User.objects.filter(username=username, is_active=False).first()
        if user is not None:
            raise exceptions.AuthenticationFailed(
                self.default_error_messages['user_not_active'],
                'no_active_account',
            )

    def validate(self, attrs):
        self.check_is_active(attrs)
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_data'] = {
            'username': user.username,
            'is_active': user.is_active
        }
        if user.is_superuser:
            token['user_data']['is_admin'] = True
            token['user_data']['manager_id'] = None
            token['user_data']['is_operational_manager'] = False
        else:
            token['user_data']['is_admin'] = False
            token['user_data']['manager_id'] = user.manager.id
            token['user_data']['is_operational_manager'] = user.manager.is_operational_manager

        return token
