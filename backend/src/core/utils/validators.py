import re
from typing import Union

from django.core.exceptions import ValidationError


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
