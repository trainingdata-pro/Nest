import re

from django.core.exceptions import ValidationError


class NoCyrillicValidator:
    def validate(self, password: str, user=None):
        if re.search(r'[а-яА-Я]', password):
            raise ValidationError('Пароль не может содержать русские буквы.')

    def get_help_text(self):
        return 'Пароль не может содержать русские буквы'


def not_negative_value_validator(value):
    if value < 0:
        raise ValidationError('Данное значение не может быть меньше 0.')


def day_hours_validator(value):
    if value > 24:
        raise ValidationError('Данное значение не может быть больше 24.')
