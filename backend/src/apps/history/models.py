from django.db import models

from apps.assessors.models import Assessor


class HistoryEvents(models.TextChoices):
    CREATED = ('created', 'Исполнитель создан')
    DELETED = ('deleted', 'Удален из команды')
    BLACKLIST = ('blacklist', 'Добавлен в ЧС')
    LEFT = ('left', 'Ушел по собств. желанию')
    RETURNED = ('returned', 'Перемещен из списка уволенных')
    RETURNED_FROM_BL = ('returned_from_bl', 'Перемещен из ЧС')

    ADD_MANAGER = ('add_manager', 'Назначен руководитель')

    ADD_PROJECT = ('add_project', 'Добавлен на проект')
    REMOVE_PROJECT = ('remove_project', 'Снят с проекта')
    ADD_ADDITIONAL_PROJECT = ('add_additional_project', 'Добавлен на доп. проект')
    REMOVE_ADDITIONAL_PROJECT = ('remove_additional_project', 'Снят с доп. проекта')

    ADD_TO_FREE_RESOURCE = ('add_to_free_resource', 'Добавлен в СР')
    REMOVE_FROM_FREE_RESOURCE = ('remove_from_free_resource', 'Удален из СР')

    ADD_ADDITIONAL_MANAGER = ('add_additional_manager', 'Добавлен доп. менеджер')
    REMOVE_ADDITIONAL_MANAGER = ('remove_additional_manager', 'Удален доп. менеджер')


class History(models.Model):
    assessor = models.ForeignKey(
        Assessor,
        verbose_name='исполнитель',
        on_delete=models.PROTECT
    )
    event = models.CharField(
        max_length=100,
        choices=HistoryEvents.choices,
        verbose_name='событие'
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(verbose_name='Описание')

    class Meta:
        db_table = 'history'
        verbose_name = 'история'
        verbose_name_plural = 'истории'
        ordering = ['-timestamp']

    def __str__(self):
        return self.event
