from django.db import models

from apps.assessors.models import Assessor


class HistoryEvents(models.TextChoices):
    CREATED = ('created', 'Добавлен в систему')
    BLACKLIST = ('blacklist', 'Добавлен в ЧС')
    LEFT = ('left', 'Уволен по собственному желанию')
    RETURNED = ('returned', 'Возвращен в команду из уволенных')
    TO_VACATION = ('to_vacation', 'Отправлен в отпуск')
    FROM_VACATION = ('from_vacation', 'Вернулся из отпуска')

    ADD_MANAGER = ('add_manager', 'Закреплен за менеджером')
    REMOVE_FROM_MANAGER = ('remove_from_manager', 'Удален из команды')

    ADD_PROJECT = ('add_project', 'Добавлен на проект')
    REMOVE_PROJECT = ('remove_project', 'Снят с проекта')

    ADD_TO_FREE_RESOURCE = ('add_to_free_resource', 'Добавлен в свободные ресурсы')
    REMOVE_FROM_FREE_RESOURCE = ('remove_from_free_resource', 'Удален из свободных ресурсов')

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
    description = models.TextField(verbose_name='Описание')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'history'
        verbose_name = 'история'
        verbose_name_plural = 'истории'
        ordering = ['-timestamp']

    def __str__(self):
        return self.event
