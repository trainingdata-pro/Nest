import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')

app = Celery('app', broker_cnnection_retry_on_startup=True)
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'update_status_task': {
        'task': 'apps.assessors.tasks.update_assessor_status',
        'schedule': crontab(hour='00', minute='00')
    },
    'remove_files_task': {
        'task': 'apps.export.tasks.remove_old_files',
        'schedule': crontab(hour='01', minute='00')
    },
    'remove_old_reset_tokens': {
        'task': 'apps.authapp.tasks.remove_old_tokens',
        'schedule': crontab(hour='12', minute='00', day_of_week='sunday')
    }
}
