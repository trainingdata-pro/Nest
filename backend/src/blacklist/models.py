from django.db import models

from assessors.models import Assessor


class BlackListItem(models.Model):
    assessor = models.OneToOneField(
        Assessor,
        on_delete=models.PROTECT,
        verbose_name='исполнитель'
    )
    last_manager = models.CharField(
        max_length=150,
        verbose_name='менеджер',
        null=True,
        blank=True
    )
    last_project = models.CharField(
        max_length=255,
        verbose_name='последние проекты',
        null=True,
        blank=True
    )
    reason = models.TextField(
        verbose_name='Причина'
    )
    date_added = models.DateField(
        auto_now_add=True,
        verbose_name='дата добавления'
    )

    class Meta:
        db_table = 'blacklist'
        verbose_name = 'запись'
        verbose_name_plural = 'записи'

    def __str__(self):
        return self.assessor.full_name