from typing import Dict, Union

from django.contrib.auth import password_validation, get_user_model
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.utils.users import UserStatus
from .models import BaseUser, ManagerProfile, Code, PasswordResetToken
from .utils.create import create_manager_profile, create_user_confirmation_code


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'last_name',
            'first_name',
            'middle_name',
            'email',
            'status',
            'password'
        ]

    def validate_password(self, password: str) -> str:
        user_model = get_user_model()
        user = user_model(email=self.initial_data.get('email'))
        password_validation.validate_password(password, user)

        return password

    def create(self, validated_data: Dict) -> BaseUser:
        if validated_data.get('status') != UserStatus.MANAGER:
            raise ValidationError(
                {'status': 'Неверный статус.'}
            )

        user_model = get_user_model()
        user = user_model.objects.create_user(
            is_active=False,
            **validated_data
        )
        create_manager_profile(user)
        create_user_confirmation_code(user)

        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'last_name',
            'first_name',
            'middle_name',
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'id',
            'username',
            'last_name',
            'first_name',
            'middle_name',
            'email',
            'status'
        ]


class ConfirmationCodeSerializer(serializers.Serializer):
    code = serializers.CharField(required=True, allow_blank=False)

    def save(self, **kwargs) -> BaseUser:
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

            return user


class UpdateManagerProfileSerializer(serializers.ModelSerializer):
    field = 'teamlead'

    class Meta:
        model = ManagerProfile
        fields = ['teamlead']

    def update(self, instance: ManagerProfile, validated_data: Dict) -> ManagerProfile:
        if instance.teamlead:
            raise ValidationError(
                {self.field: ['У вас уже есть руководитель.']}
            )

        teamlead = validated_data.get('teamlead')
        if not teamlead:
            raise ValidationError(
                {self.field: ['Укажите вашего руководителя.']}
            )

        if not teamlead.manager_profile.is_teamlead:
            raise ValidationError(
                {self.field: ['Руководитель должен быть операционным менеджером.']}
            )

        return super().update(instance, validated_data)


class ManagerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    teamlead = UserSerializer(read_only=True)

    class Meta:
        model = ManagerProfile
        fields = '__all__'


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
