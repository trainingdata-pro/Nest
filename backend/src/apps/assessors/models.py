from typing import Tuple

from django.contrib.auth import get_user_model
from django.db import models

from core.validators import (
    allowed_chars_validator,
    only_manager_validator
)
from apps.projects.models import Project

from apps.assessors.utils.validators import (
    assessor_username_validator,
    assessor_email_validator
)


class AssessorState(models.TextChoices):
    AVAILABLE = ('available', 'Доступен')
    BUSY = ('busy', 'Занят')
    FREE_RESOURCE = ('free_resource', 'Свободный ресурс')
    VACATION = ('vacation', 'Отпуск')
    BLACKLIST = ('blacklist', 'Черный список')
    FIRED = ('fired', 'Уволен')

    @classmethod
    def work_states(cls) -> Tuple:
        return cls.AVAILABLE.value, cls.BUSY.value, cls.FREE_RESOURCE.value

    @classmethod
    def fired_states(cls) -> Tuple:
        return cls.BLACKLIST.value, cls.FIRED.value

    @classmethod
    def get_value(cls, key: str) -> str:
        for state in cls.choices:
            if state[0] == key:
                return state[1]
        return '-'


class FreeResourceHours(models.TextChoices):
    NULL = ('0', '0')
    TWO_FOUR = ('2-4', '2-4')
    FOUR_SIX = ('4-6', '4-6')
    SIX_EIGHT = ('6-8', '6-8')


class Skill(models.Model):
    title = models.CharField(
        verbose_name='название',
        unique=True,
        max_length=150
    )

    class Meta:
        db_table = 'skills'
        verbose_name = 'навык'
        verbose_name_plural = 'навыки'
        ordering = ['id']

    def __str__(self):
        string = ''
        if len(str(self.title)) > 30:
            string += f'{str(self.title)[:27]}...'
        else:
            string = str(self.title)

        string += f' (pk {self.pk})'
        return string


class Assessor(models.Model):
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={
            'unique': 'Исполнитель с таким именем пользователя уже существует.',
        },
        verbose_name='имя пользователя',
        validators=[assessor_username_validator]
    )
    last_name = models.CharField(
        max_length=255,
        verbose_name='фамилия',
        validators=[allowed_chars_validator]
    )
    first_name = models.CharField(
        max_length=255,
        verbose_name='имя',
        validators=[allowed_chars_validator]
    )
    middle_name = models.CharField(
        max_length=255,
        verbose_name='отчество',
        blank=True,
        null=True,
        validators=[allowed_chars_validator]
    )
    email = models.EmailField(
        verbose_name='эл. почта',
        blank=True,
        null=True,
        validators=[assessor_email_validator]
    )
    country = models.CharField(
        max_length=255,
        verbose_name='страна',
        blank=True,
        null=True
    )
    manager = models.ForeignKey(
        get_user_model(),
        on_delete=models.PROTECT,
        verbose_name='менеджер',
        related_name='assessors',
        null=True,
        blank=True,
        validators=[only_manager_validator]
    )
    projects = models.ManyToManyField(
        Project,
        blank=True,
        verbose_name='проекты',
        related_name='assessors'
    )
    skills = models.ManyToManyField(
        Skill,
        verbose_name='навыки',
        blank=True
    )
    state = models.CharField(
        verbose_name='состояние',
        max_length=15,
        choices=AssessorState.choices
    )
    date_of_registration = models.DateField(
        auto_now_add=True,
        verbose_name='дата регистрации'
    )
    vacation_date = models.DateField(
        verbose_name='дата выхода из отпуска',
        blank=True,
        null=True
    )
    free_resource_weekday_hours = models.CharField(
        max_length=5,
        verbose_name='ресурс работы в рабочие дни, ч',
        choices=FreeResourceHours.choices,
        null=True,
        blank=True
    )
    free_resource_day_off_hours = models.CharField(
        max_length=5,
        verbose_name='ресурс работы в выходные дни, ч',
        choices=FreeResourceHours.choices,
        null=True,
        blank=True
    )
    second_manager = models.ManyToManyField(
        get_user_model(),
        blank=True,
        related_name='extra',
        verbose_name='доп. менеджеры'
    )

    class Meta:
        db_table = 'assessors'
        verbose_name = 'исполнитель'
        verbose_name_plural = 'исполнители'
        ordering = ['id']

    def __str__(self):
        return f'{self.full_name} (pk {self.pk})'

    @property
    def full_name(self) -> str:
        name = f'{self.last_name} {self.first_name}'
        if self.middle_name:
            name += f' {self.middle_name}'
        return name


class AssessorCredentials(models.Model):
    assessor = models.ForeignKey(
        Assessor,
        on_delete=models.PROTECT,
        verbose_name='менеджер'
    )
    tool = models.CharField(
        verbose_name='инструмент',
        max_length=150
    )
    login = models.CharField(
        verbose_name='логин',
        max_length=150
    )
    password = models.CharField(
        verbose_name='пароль',
        max_length=150
    )

    class Meta:
        db_table = 'assessor_credentials'
        verbose_name = 'учетные данные'
        verbose_name_plural = 'учетные данные'
        ordering = ['id']

    def __str__(self):
        return f'{self.tool} (pk {self.pk})'
