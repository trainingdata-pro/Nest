import uuid

from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models

from core.utils.validators import email_domain_validator, allowed_chars_validator
from .utils import _create_expiration_date


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

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        if extra_fields.get('is_active') is not True:
            raise ValueError('Superuser must have is_active=True.')

        return self.__create_user(email, password, **extra_fields)


class BaseUser(AbstractUser):
    first_name = None
    last_name = None
    email = models.EmailField(
        'email',
        unique=True,
        db_index=True,
        validators=[email_domain_validator]
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


class ManagerProfile(models.Model):
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='manager'
    )
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
    is_teamlead = models.BooleanField(
        default=False,
        verbose_name='teamlead'
    )
    teamlead = models.ForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        verbose_name='руководитель'
    )

    class Meta:
        db_table = 'managers'
        verbose_name = 'профиль менеджера'
        verbose_name_plural = 'профили менеджеров'
        ordering = ['id']

    def __str__(self):
        return str(self.full_name)

    @property
    def full_name(self) -> str:
        return f'{self.last_name} {self.first_name} {self.middle_name}'


class Code(models.Model):
    code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='код'
    )
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='code'
    )

    class Meta:
        db_table = 'codes'
        verbose_name = 'код подтверждения'
        verbose_name_plural = 'коды подтверждения'

    def __str__(self):
        return str(self.code)


class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE
    )
    token = models.UUIDField(
        default=uuid.uuid4,
        editable=False
    )
    expiration_time = models.DateTimeField(
        default=_create_expiration_date
    )

    def __str__(self):
        return str(self.token)
