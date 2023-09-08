from typing import Dict, Union

from django.contrib.auth import password_validation, get_user_model
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import BaseUser, ManagerProfile, Code, PasswordResetToken
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

    def validate_password(self, password: str) -> str:
        model = get_user_model()
        user = model(username=self.initial_data.get('username'))
        password_validation.validate_password(password, user)

        return password

    def create(self, validated_data: Dict) -> ManagerProfile:
        user_model = get_user_model()
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = user_model.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=False
        )
        manager = ManagerProfile.objects.create(
            user=user,
            is_teamlead=False
        )
        code = create_code()
        Code.objects.create(
            code=code,
            user=user
        )

        return manager


class UpdateManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerProfile
        fields = [
            'first_name',
            'last_name',
            'middle_name',
            'teamlead'
        ]

    @staticmethod
    def check_team_lead(manager: ManagerProfile) -> ManagerProfile:
        if not manager.is_teamlead:
            raise ValidationError(
                {'teamlead': 'Руководитель должен быть операционным менеджером.'}
            )
        return manager

    def update(self, instance: ManagerProfile, validated_data: Dict) -> ManagerProfile:
        teamlead = validated_data.get('teamlead')
        if not instance.teamlead and not teamlead:
            raise ValidationError(
                {'teamlead': 'Укажите вашего руководителя.'}
            )
        self.check_team_lead(teamlead)

        return super().update(instance, validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']


class ManagerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ManagerProfile
        fields = '__all__'


class CodeSerializer(serializers.Serializer):
    code = serializers.CharField(required=True, allow_blank=False)

    def save(self, **kwargs) -> ManagerProfile:
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
    def _get_user(email: str) -> BaseUser:
        user_model = get_user_model()
        return user_model.objects.filter(email=email).first()

    def _new_token(self, user: BaseUser) -> PasswordResetToken:
        self.__remove_unused_token(user)
        return self.__create_token(user)

    @staticmethod
    def __remove_unused_token(user: BaseUser) -> None:
        PasswordResetToken.objects.filter(user=user).delete()

    @staticmethod
    def __create_token(user: BaseUser) -> PasswordResetToken:
        token = PasswordResetToken.objects.create(user=user)
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
        token = self._new_token(self.user)

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

        if timezone.now() > token_obj.expiration_time:
            token_obj.delete()
            raise ValidationError(
                {'token': ['Срок действия ссылки истек.']}
            )

        password = attrs.get('password')
        user_model = get_user_model()
        user = user_model(username=token_obj.user.username)
        password_validation.validate_password(password, user)

        self.obj = token_obj

        return attrs

    def save(self, **kwargs) -> BaseUser:
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
        user_model = get_user_model()
        user = user_model(username=self.instance.username)
        password_validation.validate_password(new_password, user)

        return attrs

    def update(self, instance: BaseUser, validated_data: Dict) -> BaseUser:
        instance.set_password(validated_data.get('new_password'))
        instance.save()

        return instance
