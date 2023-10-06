from django.db import models

from apps.assessors.models import Assessor


class HistoryAction(models.TextChoices):
    CREATED = ('created', 'Создать исполнителя')
    TO_TEAM = ('to_team', 'Забрать в команду')
    RENT = ('rent', 'Арендовать')

    ADD_PROJECT = ('add_project', 'Добавить проект')
    REMOVE_PROJECT = ('remove_project', 'Удалить с проекта')
    COMPLETE_PROJECT = ('complete_project', 'Завершить проект')

    FIRE = ('left', 'Уволить')
    UNPIN = ('unpin', 'Открепить от себя')

    ADD_TO_FREE_RESOURCE = ('add_to_free_resource', 'Отправить в свободные ресурсы')
    RETURN_FROM_FREE_RESOURCE = ('return_from_free_resource', 'Вернуть из свободных ресурсов')

    TO_VACATION = ('to_vacation', 'Отправить в отпуск')
    FROM_VACATION = ('from_vacation', 'Вернуть из отпуска')


class HistoryAttribute(models.TextChoices):
    FULL_NAME = ('full_name', 'ФИО')
    USERNAME = ('username', 'Никнейм в Telegram')
    MANAGER = ('manager', 'Руководитель')
    PROJECT = ('project', 'Проект')
    STATE = ('state', 'Состояние')


class History(models.Model):
    assessor = models.ForeignKey(
        Assessor,
        verbose_name='исполнитель',
        on_delete=models.PROTECT
    )
    action = models.CharField(
        max_length=30,
        choices=HistoryAction.choices,
        verbose_name='действие',
        null=True
    )
    attribute = models.CharField(
        max_length=10,
        choices=HistoryAttribute.choices,
        verbose_name='атрибут'
    )
    old_value = models.TextField(
        verbose_name='старое значение',
        null=True
    )
    new_value = models.TextField(
        verbose_name='новое значение',
        null=True
    )
    reason = models.TextField(
        verbose_name='причина',
        null=True
    )
    user = models.CharField(
        max_length=155,
        verbose_name='пользователь'
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='дата/время'
    )

    class Meta:
        db_table = 'history'
        verbose_name = 'история'
        verbose_name_plural = 'истории'
        ordering = ['-timestamp']

    def __str__(self):
        return str(self.attribute)
