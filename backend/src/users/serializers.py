from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.settings import VALID_EMAIL_DOMAINS

from .models import Manager, Code
from .utils import create_code


class CreateManagerSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)

    def validate_username(self, username: str) -> str:
        if User.objects.filter(username=username).exists():
            raise ValidationError(
                f'Пользователь {username} уже существует.'
            )

        return username

    def validate_email(self, email: str) -> str:
        if User.objects.filter(email=email).exists():
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
        user = User(username=self.initial_data.get('username'))
        password_validation.validate_password(password, user)

        return password

    def create(self, validated_data) -> Manager:
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = User.objects.create_user(
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
        fields = (
            'first_name',
            'last_name',
            'middle_name',
            'operational_manager'
        )

    @staticmethod
    def check_team_lead(manager):
        if not manager.is_operational_manager:
            raise ValidationError(
                {'operational_manager': 'Руководитель должен быть операционным менеджером.'}
            )
        return manager

    def update(self, instance, validated_data):
        operational_manager = validated_data.get('operational_manager')
        if not instance.operational_manager and not operational_manager:
            raise ValidationError(
                {'operational_manager': 'Укажите вашего руководителя.'}
            )
        self.check_team_lead(operational_manager)
        return super().update(instance, validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


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
