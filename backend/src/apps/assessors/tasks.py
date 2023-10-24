from config.celery import app

from .utils.status_tracker import check_assessors_on_vacation


@app.task
def update_assessor_status():
    check_assessors_on_vacation()
