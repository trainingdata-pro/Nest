from django.db import models


class UserStatus(models.TextChoices):
    """ Base user statuses """
    ADMIN = ('admin', 'Администратор')
    MANAGER = ('manager', 'Менеджер')
    ANALYST = ('analyst', 'Аналитик')
