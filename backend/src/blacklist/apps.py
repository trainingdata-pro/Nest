from django.apps import AppConfig


class BlacklistConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blacklist'
    verbose_name = 'черный список'
