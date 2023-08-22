from django.contrib.auth.models import User
from django.db import models


class Manager(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='manager'
    )
    last_name = models.CharField(
        max_length=255,
        verbose_name='фамилия',
        blank=True
    )
    first_name = models.CharField(
        max_length=255,
        verbose_name='имя',
        blank=True
    )
    middle_name = models.CharField(
        max_length=255,
        verbose_name='отчество',
        blank=True
    )
    is_operational_manager = models.BooleanField(
        default=False,
        verbose_name='операционный менеджер'
    )
    operational_manager = models.ForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        verbose_name='руководитель'
    )

    class Meta:
        db_table = 'managers'
        verbose_name = 'менеджер'
        verbose_name_plural = 'менеджеры'

    def __str__(self):
        return self.full_name

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
        to=User,
        on_delete=models.CASCADE,
        related_name='code'
    )

    class Meta:
        db_table = 'codes'
        verbose_name = 'код подтверждения'
        verbose_name_plural = 'коды подтверждения'
