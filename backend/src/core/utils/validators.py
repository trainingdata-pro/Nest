import re
from typing import Union

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from core.settings import VALID_EMAIL_DOMAINS
from .users import UserStatus


def only_manager_validator(user) -> None:
    error = 'Выбранный пользователь не является менеджером.'
    if isinstance(user, int):
        user_model = get_user_model()
        if not user_model.objects.filter(id=user, status=UserStatus.MANAGER).exists():
            raise ValidationError(error)
    else:
        if user.status != UserStatus.MANAGER:
            raise ValidationError(error)


class NoCyrillicValidator:
    def validate(self, password: str, user=None) -> None:
        if re.search(r'[а-яА-Я]', password):
            raise ValidationError('Пароль не может содержать русские буквы.')

    def get_help_text(self) -> str:
        return 'Пароль не может содержать русские буквы'


def not_negative_value_validator(value: Union[int, float]) -> None:
    if value < 0:
        raise ValidationError('Данное значение не может быть меньше 0.')


def day_hours_validator(value: Union[int, float]) -> None:
    if value > 24:
        raise ValidationError('Данное значение не может быть больше 24.')


def email_domain_validator(email: str) -> None:
    domain = email.split('@')[-1]
    if domain.lower() not in VALID_EMAIL_DOMAINS:
        raise ValidationError(
            'Используйте корпоративную электронную почту.'
        )


def allowed_chars_validator(string: str) -> None:
    pattern = r'^[a-zA-Zа-яА-Я\s\-]+$'
    if not re.match(pattern, string):
        raise ValidationError(
            'Недопустимые символы в тексте.'
        )
