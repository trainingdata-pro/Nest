from django.db import models


class UserStatus(models.TextChoices):
    ADMIN = ('admin', 'Администратор')
    MANAGER = ('manager', 'Менеджер')
    ANALYST = ('analyst', 'Аналитик')
