from typing import Union

from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ObjectDoesNotExist
from django.db import models

from core.users import UserStatus
from core.validators import (
    email_domain_validator,
    allowed_chars_validator,
    only_manager_validator
)


class UserManager(BaseUserManager):
    def __create_user(self, email, password, **extra_fields):
        user = self.model(
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self.__create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('status', UserStatus.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        if extra_fields.get('is_active') is not True:
            raise ValueError('Superuser must have is_active=True.')

        if extra_fields.get('status') != UserStatus.ADMIN:
            raise ValueError('Superuser mush have ADMIN status.')

        return self.__create_user(email, password, **extra_fields)


class BaseUser(AbstractUser):
    last_name = models.CharField(
        max_length=255,
        verbose_name='фамилия',
        blank=True,
        validators=[allowed_chars_validator]
    )
    first_name = models.CharField(
        max_length=255,
        verbose_name='имя',
        blank=True,
        validators=[allowed_chars_validator]
    )
    middle_name = models.CharField(
        max_length=255,
        verbose_name='отчество',
        blank=True,
        validators=[allowed_chars_validator]
    )
    email = models.EmailField(
        'email',
        unique=True,
        db_index=True,
        validators=[email_domain_validator]
    )
    status = models.CharField(
        'статус',
        max_length=10,
        choices=UserStatus.choices
    )
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'
        ordering = ['id']

    def __str__(self):
        return str(self.email)

    @property
    def full_name(self) -> str:
        return f'{self.last_name} {self.first_name} {self.middle_name}'

    @property
    def manager_profile(self) -> Union['ManagerProfile', None]:
        obj = None
        try:
            obj = ManagerProfile.objects.get(user=self)
        except ObjectDoesNotExist:
            pass

        return obj


class ManagerProfile(models.Model):
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='manager_profile'
    )
    is_teamlead = models.BooleanField(
        default=False,
        verbose_name='teamlead'
    )
    teamlead = models.ForeignKey(
        get_user_model(),
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        verbose_name='руководитель',
        validators=[only_manager_validator]
    )

    class Meta:
        db_table = 'manager profiles'
        verbose_name = 'профиль менеджера'
        verbose_name_plural = 'профили менеджеров'
        ordering = ['id']
