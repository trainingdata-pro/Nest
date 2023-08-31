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

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        self.user = None

    @staticmethod
    def _get_user(email: str) -> user_model:
        return user_model.objects.filter(email=email).first()

    @staticmethod
    def __remove_unused_token(user: user_model) -> None:
        PasswordResetToken.objects.filter(user=user).delete()

    def __create_token(self, user: user_model) -> PasswordResetToken:
        self.__remove_unused_token(user)
        token = PasswordResetToken.objects.create(
            user=user
        )

        return token

    def validate(self, attrs: Dict) -> Dict:
        attrs = super().validate(attrs)
        email = attrs.get('email')
        user = self._get_user(email)
        if user is None:
            raise ValidationError(
                {'email': ['Пользователь с таким электронным адресом не найден.']}
            )

        self.user = user

        return attrs

    def create(self, validated_data) -> Union[PasswordResetToken, None]:
        token = self.__create_token(self.user)

        return token


class PasswordSetSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(max_length=255)

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        self.obj = None

    def validate(self, attrs: Dict) -> Dict:
        super().validate(attrs)

        token = attrs.get('token')
        token_obj = PasswordResetToken.objects.filter(token=token).first()
        if not token_obj:
            raise ValidationError(
                {'token': ['Неверный токен.']}
            )

        password = attrs.get('password')
        user = user_model(username=token_obj.user.username)
        password_validation.validate_password(password, user)

        self.obj = token_obj

        return attrs

    def save(self, **kwargs) -> user_model:
        user = self.obj.user
        password = self.validated_data.get('password')
        user.set_password(password)
        user.save()
        self.obj.delete()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=255)
    new_password = serializers.CharField(max_length=255)

    def validate(self, attrs: Dict) -> Dict:
        attrs = super().validate(attrs)

        old_password = attrs.get('old_password')
        if old_password is None:
            raise ValidationError(
                {'old_password': ['Это поле не может быть пустым.']}
            )

        new_password = attrs.get('new_password')
        if new_password is None:
            raise ValidationError(
                {'new_password': ['Это поле не может быть пустым.']}
            )

        if not self.instance.check_password(old_password):
            raise ValidationError(
                {'old_password': ['Неверный пароль.']}
            )

        new_password = attrs.get('new_password')
        user = user_model(username=self.instance.username)
        password_validation.validate_password(new_password, user)

        return attrs

    def update(self, instance: user_model, validated_data: Dict) -> user_model:
        instance.set_password(validated_data.get('new_password'))
        instance.save()

        return instance
