from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
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
