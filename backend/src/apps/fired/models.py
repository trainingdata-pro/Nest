from django.db import models

from apps.assessors.models import Assessor


class Reason(models.Model):
    title = models.CharField(
        verbose_name='причина',
        max_length=255
    )
    blacklist_reason = models.BooleanField(
        verbose_name='для черного списка'
    )

    class Meta:
        db_table = 'reasons'
        verbose_name = 'причина увольнения'
        verbose_name_plural = 'причины увольнения'
        ordering = ['id']

    def __str__(self):
        return str(self.title)


class BaseStateModel(models.Model):
    assessor = models.OneToOneField(
        Assessor,
        verbose_name='исполнитель',
        on_delete=models.PROTECT
    )
    date = models.DateField(
        verbose_name='дата',
        auto_now_add=True
    )

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.assessor)


class Fired(BaseStateModel):
    reason = models.ForeignKey(
        Reason,
        verbose_name='причина',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'fired'
        verbose_name = 'уволенный'
        verbose_name_plural = 'уволенные'
        ordering = ['id']


class BlackList(BaseStateModel):
    reason = models.ForeignKey(
        Reason,
        verbose_name='причина',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'blacklist'
        verbose_name = 'черный список'
        verbose_name_plural = 'черный список'
        ordering = ['id']
