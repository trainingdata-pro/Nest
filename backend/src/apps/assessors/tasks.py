from celery import shared_task

from .utils.status_tracker import check_assessors_on_vacation


@shared_task
def update_assessor_status():
    check_assessors_on_vacation()
