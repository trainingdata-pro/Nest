from typing import Dict, Union

from django.contrib.auth import password_validation, get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.settings import VALID_EMAIL_DOMAINS

from .models import user_model, Manager, Code, PasswordResetToken
from .utils import create_code


class CreateManagerSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)

    def validate_username(self, username: str) -> str:
        model = get_user_model()
        if model.objects.filter(username=username).exists():
            raise ValidationError(
                f'Пользователь {username} уже существует.'
            )

        return username

    def validate_email(self, email: str) -> str:
        model = get_user_model()
        if model.objects.filter(email=email).exists():
            raise ValidationError(
                'Пользователь с таким эл. адресом уже существует.'
            )

        domain = email.split('@')[-1]
        if domain.lower() not in VALID_EMAIL_DOMAINS:
            raise ValidationError(
                'Используйте корпоративную электронную почту.'
            )

        return email

    def validate_password(self, password: str) -> str:
        model = get_user_model()
        user = model(username=self.initial_data.get('username'))
        password_validation.validate_password(password, user)

        return password

    def create(self, validated_data: Dict) -> Manager:
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = user_model.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=False
        )
        manager = Manager.objects.create(
            user=user,
            is_operational_manager=False
        )
        code = create_code()
        Code.objects.create(
            code=code,
            user=user
        )

        return manager


class UpdateManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = [
            'first_name',
            'last_name',
            'middle_name',
            'operational_manager'
        ]

    @staticmethod
    def check_team_lead(manager: Manager) -> Manager:
        if not manager.is_operational_manager:
            raise ValidationError(
                {'operational_manager': 'Руководитель должен быть операционным менеджером.'}
            )
        return manager

    def update(self, instance: Manager, validated_data: Dict) -> Manager:
        operational_manager = validated_data.get('operational_manager')
        if not instance.operational_manager and not operational_manager:
            raise ValidationError(
                {'operational_manager': 'Укажите вашего руководителя.'}
            )
        self.check_team_lead(operational_manager)

        return super().update(instance, validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_model
        fields = ['id', 'username', 'email']


class ManagerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Manager
        fields = '__all__'


class CodeSerializer(serializers.Serializer):
    code = serializers.CharField(required=True, allow_blank=False)

    def save(self, **kwargs) -> Manager:
        code = self.validated_data.get('code')
        obj = Code.objects.filter(code=code)
        if not obj.exists():
            raise ValidationError(
                {'code': ['Неверный код активации.']}
            )
        else:
            confirmation_code = obj.first()
            user = confirmation_code.user
            user.is_active = True
            user.save()

            confirmation_code.delete()

            return user.manager


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    @staticmethod
    def _get_user(email: str) -> user_model:
        return user_model.objects.filter(email=email).first()

    @staticmethod
    def __create_token(user: user_model) -> PasswordResetToken:
        token = PasswordResetToken.objects.create(
            user=user
        )

        return token

    def create(self, validated_data) -> Union[PasswordResetToken, None]:
        email = validated_data.get('email')
        user = self._get_user(email)

        if user is not None:
            token = self.__create_token(user)
        else:
            token = None

        return token


class PasswordSetSerializer(serializers.Serializer):
    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        self.obj = None

    token = serializers.UUIDField()
    password = serializers.CharField(max_length=255)

    def validate(self, attrs: Dict) -> Dict:
        super().validate(attrs)

        password = attrs.get('password')
        model = get_user_model()
        user = model(username=self.initial_data.get('username'))
        password_validation.validate_password(password, user)

        token = attrs.get('token')
        token_obj = PasswordResetToken.objects.filter(token=token).first()
        if not token_obj:
            raise ValidationError(
                {'token': ['Неверный токен.']}
            )

        self.obj = token_obj

        return attrs

    def save(self, **kwargs) -> user_model:
        user = self.obj.user
        password = self.validated_data.get('password')
        user.set_password(password)
        user.save()
        self.obj.delete()

        return user
