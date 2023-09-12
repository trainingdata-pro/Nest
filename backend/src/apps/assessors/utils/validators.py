from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

user_model = get_user_model()


def assessor_username_validator(value: str) -> None:
    if user_model.objects.filter(username__iexact=value).exists():
        raise ValidationError('Данное имя пользователя используется менеджером компании.')


def assessor_email_validator(value: str) -> None:
    if user_model.objects.filter(email__iexact=value).exists():
        raise ValidationError('Данный email используется менеджером компании.')
