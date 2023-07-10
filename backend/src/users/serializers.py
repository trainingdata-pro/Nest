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

    last_name = serializers.CharField(max_length=255)
    first_name = serializers.CharField(max_length=255)
    middle_name = serializers.CharField(max_length=255)
    is_operational_manager = serializers.BooleanField(default=False)
    operational_manager = serializers.PrimaryKeyRelatedField(
        queryset=Manager.objects.filter(is_operational_manager=True),
        allow_null=True,
        allow_empty=True,
        required=False
    )

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
        if len(password) < 8:
            raise ValidationError(
                'Пароль не должен быть короче 8 символов.'
            )

        return password

    # def validate_is_operational_manager(self, is_operational_manager: bool) -> bool:
    #     operational_manager = self.initial_data.get('operational_manager')
    #     if not is_operational_manager and not operational_manager:
    #         raise ValidationError(
    #             'Вы должны выбрать операционного менеджера.'
    #         )
    #
    #     return is_operational_manager

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

        last_name = validated_data.get('last_name')
        first_name = validated_data.get('first_name')
        middle_name = validated_data.get('middle_name')
        manager = Manager.objects.create(
            last_name=last_name,
            first_name=first_name,
            middle_name=middle_name,
            is_operational_manager=False,
            operational_manager=None,
            user=user,
        )

        code = create_code()
        Code.objects.create(
            code=code,
            user=user
        )

        return manager


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
