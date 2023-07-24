from django.db import models

from projects.models import Project
from users.models import Manager


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
    # is_free_resource = models.BooleanField(
    #     default=False,
    #     verbose_name='св. ресурс'
    # )
    # second_manager = models.ManyToManyField(
    #     Manager,
    #     blank=True,
    #     related_name='extra',
    #     verbose_name='Доп. менеджеры'
    # )
    # max_count_of_second_managers = models.IntegerField(
    #     null=True,
    #     blank=True,
    #     verbose_name='Макс. к-во доп. менеджеров'
    # )
    projects = models.ManyToManyField(
        Project,
        blank=True,
        verbose_name='проекты',
        related_name='assessors'
    )
    is_busy = models.BooleanField(
        default=False,
        verbose_name='занят'
    )
    # blacklist = models.BooleanField(
    #     default=False,
    #     verbose_name='черный список'
    # )
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
