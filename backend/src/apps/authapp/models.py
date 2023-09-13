import uuid

from django.contrib.auth import get_user_model
from django.db import models

from apps.authapp.utils.common import create_expiration_date


class Code(models.Model):
    code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='код'
    )
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='code'
    )

    class Meta:
        db_table = 'codes'
        verbose_name = 'код подтверждения'
        verbose_name_plural = 'коды подтверждения'

    def __str__(self):
        return str(self.code)


class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE
    )
    token = models.UUIDField(
        default=uuid.uuid4,
        editable=False
    )
    expiration_time = models.DateTimeField(
        default=create_expiration_date
    )

    def __str__(self):
        return str(self.token)
