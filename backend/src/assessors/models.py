from django.db import models

from core.utils.validators import not_negative_value_validator
from projects.models import Project
from users.models import Manager


class AssessorStatus(models.TextChoices):
    FULL = ('full', 'Полная загрузка')
    PARTIAL = ('partial', 'Частичная загрузка')
    FREE = ('free', 'Свободен')


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

    def __str__(self):
        if len(str(self.title)) > 30:
            return f'{str(self.title)[:27]}...'

        return self.title


class Assessor(models.Model):
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={
            'unique': 'Исполнитель с таким именем пользователя уже существует.',
        },
        verbose_name='имя пользователя'
    )
    last_name = models.CharField(
        max_length=255,
        verbose_name='фамилия'
    )
    first_name = models.CharField(
        max_length=255,
        verbose_name='имя'
    )
    middle_name = models.CharField(
        max_length=255,
        verbose_name='отчество'
    )
    manager = models.ForeignKey(
        Manager,
        on_delete=models.PROTECT,
        verbose_name='менеджер',
        related_name='assessor',
        null=True,
        blank=True
    )
    projects = models.ManyToManyField(
        Project,
        blank=True,
        verbose_name='проекты',
        related_name='assessors'
    )
    status = models.CharField(
        verbose_name='статус',
        max_length=10,
        choices=AssessorStatus.choices,
        default=AssessorStatus.FREE
    )
    capacity = models.FloatField(
        verbose_name='загруженность',
        validators=[not_negative_value_validator],
        default=0.0
    )
    skills = models.ManyToManyField(
        to=Skill,
        verbose_name='навыки',
        blank=True
    )
    is_free_resource = models.BooleanField(
        default=False,
        verbose_name='св. ресурс'
    )
    second_manager = models.ManyToManyField(
        Manager,
        blank=True,
        related_name='extra',
        verbose_name='Доп. менеджеры'
    )
    # max_count_of_second_managers = models.IntegerField(
    #     null=True,
    #     blank=True,
    #     verbose_name='Макс. к-во доп. менеджеров'
    # )

    blacklist = models.BooleanField(
        default=False,
        verbose_name='черный список'
    )
    date_of_registration = models.DateField(
        auto_now_add=True,
        verbose_name='дата регистрации'
    )

    class Meta:
        db_table = 'assessors'
        verbose_name = 'исполнитель'
        verbose_name_plural = 'исполнители'

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        return f'{self.last_name} {self.first_name} {self.middle_name}'

    @property
    def all_projects(self):
        if self.projects.exists():
            return '; '.join([pr.name for pr in self.current_project.all()])
        return '-'


class WorkingHours(models.Model):
    assessor = models.OneToOneField(
        to=Assessor,
        on_delete=models.PROTECT,
        verbose_name='рабочие часы'
    )
    monday = models.IntegerField(
        validators=[not_negative_value_validator],
        verbose_name='понедельник',
        default=0
    )
    tuesday = models.IntegerField(
        validators=[not_negative_value_validator],
        verbose_name='вторник',
        default=0
    )
    wednesday = models.IntegerField(
        validators=[not_negative_value_validator],
        verbose_name='среда',
        default=0
    )
    thursday = models.IntegerField(
        validators=[not_negative_value_validator],
        verbose_name='четверг',
        default=0
    )
    friday = models.IntegerField(
        validators=[not_negative_value_validator],
        verbose_name='пятница',
        default=0
    )
    saturday = models.IntegerField(
        validators=[not_negative_value_validator],
        verbose_name='суббота',
        default=0
    )
    sunday = models.IntegerField(
        validators=[not_negative_value_validator],
        verbose_name='воскресенье',
        default=0
    )

    class Meta:
        db_table = 'working_hours'
        verbose_name = 'рабочие часы'
        verbose_name_plural = 'рабочие часы'

    @property
    def total(self):
        return (self.monday + self.tuesday + self.wednesday +
                self.thursday + self.friday + self.saturday + self.sunday)
