from django.db import models

from users.models import Manager


class Project(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
        error_messages={
            'unique': 'Проект с таким названием уже существует.',
        },
        verbose_name='название'

    )
    owner = models.ForeignKey(
        Manager,
        on_delete=models.PROTECT,
        verbose_name='владелец'
    )
    date_of_create = models.DateField(
        auto_now_add=True,
        verbose_name='дата создания'
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'projects'
        verbose_name = 'проект'
        verbose_name_plural = 'проекты'
