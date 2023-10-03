from django.contrib.auth import get_user_model
from django.db import models

from core.utils.common import current_date
from core.utils.validators import not_negative_value_validator, day_hours_validator


class ProjectTag(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'project_tags'
        verbose_name = 'тег'
        verbose_name_plural = 'теги'
        ordering = ['id']

    def __str__(self):
        return self.name


class ProjectStatuses(models.TextChoices):
    NEW = ('new', 'Новый')
    PILOT = ('pilot', 'Пилот')
    ACTIVE = ('active', 'В работе')
    PAUSE = ('pause', 'На паузе')
    COMPLETED = ('completed', 'Завершен')

    @classmethod
    def get_value(cls, key: str) -> str:
        for state in cls.choices:
            if state[0] == key:
                return state[1]
        return '-'


class Project(models.Model):
    asana_id = models.CharField(
        max_length=50,
        verbose_name='asana ID'
    )
    name = models.CharField(
        max_length=255,
        verbose_name='название'

    )
    manager = models.ManyToManyField(
        get_user_model(),
        verbose_name='менеджеры',
        blank=True
    )
    speed_per_hour = models.IntegerField(
        verbose_name='скорость в час',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    price_for_assessor = models.FloatField(
        verbose_name='цена за единицу для ассессора',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    price_for_costumer = models.FloatField(
        verbose_name='цена за единицу для заказчика',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    unloading_value = models.CharField(
        verbose_name='объем выгрузок',
        max_length=255,
        blank=True,
        null=True
    )
    unloading_regularity = models.IntegerField(
        verbose_name='регулярность выгрузок',
        validators=[not_negative_value_validator],
        blank=True,
        null=True
    )
    status = models.CharField(
        verbose_name='статус проекта',
        choices=ProjectStatuses.choices,
        max_length=10
    )
    tag = models.ManyToManyField(
        ProjectTag,
        verbose_name='тег',
        blank=True
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
        ordering = ['id']

    def __str__(self):
        return self.name

    @property
    def managers(self) -> str:
        if self.manager.exists():
            return ', '.join([man.full_name for man in self.manager.all()])
        return '-'


class ProjectWorkingHours(models.Model):
    assessor = models.ForeignKey(
        to='assessors.Assessor',
        on_delete=models.PROTECT,
        verbose_name='исполнитель',
        related_name='project_working_hours'
    )
    project = models.ForeignKey(
        to=Project,
        on_delete=models.PROTECT,
        verbose_name='проект'
    )
    monday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='понедельник',
        default=0
    )
    tuesday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='вторник',
        default=0
    )
    wednesday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='среда',
        default=0
    )
    thursday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='четверг',
        default=0
    )
    friday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='пятница',
        default=0
    )
    saturday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='суббота',
        default=0
    )
    sunday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='воскресенье',
        default=0
    )

    class Meta:
        db_table = 'project_working_hours'
        verbose_name = 'рабочие часы'
        verbose_name_plural = 'рабочие часы'
        ordering = ['id']

    @property
    def total(self) -> int:
        return (int(self.monday) + int(self.tuesday) + int(self.wednesday)
                + int(self.thursday) + int(self.friday) + int(self.saturday)
                + int(self.sunday))


class Status(models.TextChoices):
    FULL = ('full', 'Полная загрузка')
    PARTIAL = ('partial', 'Частичная загрузка')
    RESERVED = ('reserved', 'Зарезервирован')


class WorkLoadStatus(models.Model):
    assessor = models.ForeignKey(
        to='assessors.Assessor',
        on_delete=models.PROTECT,
        verbose_name='исполнитель',
        related_name='workload_status'
    )
    project = models.ForeignKey(
        to=Project,
        on_delete=models.PROTECT,
        verbose_name='проект'
    )
    status = models.CharField(
        verbose_name='статус',
        max_length=10,
        choices=Status.choices
    )

    class Meta:
        db_table = 'workload_statuses'
        verbose_name = 'статус загрузки'
        verbose_name_plural = 'статусы загрузки'
        ordering = ['id']
