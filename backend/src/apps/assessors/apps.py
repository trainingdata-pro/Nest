from django.apps import AppConfig


class AssessorsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.assessors'
    verbose_name = 'исполнитель'
    verbose_name_plural = 'исполнители'

    def ready(self):
        import apps.assessors.signals  # noqa
