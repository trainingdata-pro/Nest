from django.db import models

from core.utils.validators import not_negative_value_validator
from users.models import Manager


class ProjectStatuses(models.TextChoices):
    ACTIVE = ('active', 'Активный')
    PAUSE = ('pause', 'На паузе')
    COMPLETED = ('completed', 'Завершен')


class Project(models.Model):
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
        validators=[not_negative_value_validator]
    )
    price_for_assessor = models.FloatField(
        verbose_name='Цена за единицу для ассессора',
        validators=[not_negative_value_validator]
    )
    price_for_costumer = models.FloatField(
        verbose_name='Цена за единицу для заказчика',
        validators=[not_negative_value_validator]
    )
    unloading_value = models.IntegerField(
        verbose_name='Объем выгрузок',
        validators=[not_negative_value_validator]
    )
    unloading_regularity = models.IntegerField(
        verbose_name='Регулярность выгрузок',
        validators=[not_negative_value_validator]
    )
    status = models.CharField(
        verbose_name='статус проекта',
        choices=ProjectStatuses.choices,
        default=ProjectStatuses.ACTIVE,
        max_length=10
    )
    date_of_creation = models.DateField(
        auto_now_add=True,
        verbose_name='дата старта'
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'projects'
        verbose_name = 'проект'
        verbose_name_plural = 'проекты'
