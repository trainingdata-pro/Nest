from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        if user.is_superuser:
            token['is_operational_manager'] = False
        else:
            token['manager_id'] = user.manager.id
            token['is_operational_manager'] = user.manager.is_operational_manager

        token['username'] = user.username
        token['is_active'] = user.is_active

        return token
