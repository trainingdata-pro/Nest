from django.db import models

from core.utils.common import current_date
from core.utils.validators import not_negative_value_validator
from apps.users.models import Manager


class ProjectTag(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'project_tags'
        verbose_name = 'тег'
        verbose_name_plural = 'теги'

    def __str__(self):
        return self.name


class ProjectStatuses(models.TextChoices):
    ACTIVE = ('active', 'Активный')
    PAUSE = ('pause', 'На паузе')
    COMPLETED = ('completed', 'Завершен')


class Project(models.Model):
    asana_id = models.BigIntegerField(
        verbose_name='asana ID',
        unique=True,
        blank=True,  # TODO
        null=True
    )
    name = models.CharField(
        max_length=255,
        unique=True,
        error_messages={
            'unique': 'Проект с таким названием уже существует.',
        },
        verbose_name='название'

    )
    manager = models.ManyToManyField(
        Manager,
        verbose_name='менеджеры'
    )
    speed_per_hour = models.IntegerField(
        verbose_name='Скорость в час',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    price_for_assessor = models.FloatField(
        verbose_name='Цена за единицу для ассессора',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    price_for_costumer = models.FloatField(
        verbose_name='Цена за единицу для заказчика',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    unloading_value = models.IntegerField(
        verbose_name='Объем выгрузок',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    unloading_regularity = models.IntegerField(
        verbose_name='Регулярность выгрузок',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    status = models.CharField(
        verbose_name='статус проекта',
        choices=ProjectStatuses.choices,
        default=ProjectStatuses.ACTIVE,
        max_length=10
    )
    tag = models.ManyToManyField(
        ProjectTag,
        verbose_name='тег'
    )
    date_of_creation = models.DateField(
        default=current_date,
        verbose_name='дата старта'
    )
    date_of_completion = models.DateField(
        verbose_name='дата завершения',
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'projects'
        verbose_name = 'проект'
        verbose_name_plural = 'проекты'

    def __str__(self):
        return self.name

    @property
    def managers(self) -> str:
        if self.manager.exists():
            return ', '.join([man.full_name for man in self.manager.all()])
        return '-'
