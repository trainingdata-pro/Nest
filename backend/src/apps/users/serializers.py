from typing import Dict

from django.contrib.auth import password_validation, get_user_model

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.authapp.services.auth_service import auth_service
from core.users import UserStatus
from .models import BaseUser, ManagerProfile
from .services.user_service import user_service, profile_service


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
                {'status': ['Неверный статус.']}
            )

        user = user_service.create_user(**validated_data)
        profile_service.create_profile(user)
        auth_service.create_code(user)
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
