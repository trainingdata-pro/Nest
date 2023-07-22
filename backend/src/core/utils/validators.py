import re

from django.core.exceptions import ValidationError


class NoCyrillicValidator:
    def validate(self, password: str, user=None):
        if re.search(r'[а-яА-Я]', password):
            raise ValidationError('Пароль не может содержать русские буквы.')

    def get_help_text(self):
        return 'Пароль не может содержать русские буквы'
