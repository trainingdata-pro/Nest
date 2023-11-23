from config.celery import app

from .utils.google_sheets import update_sheet
from .utils.status_tracker import check_assessors_on_vacation


@app.task
def update_assessor_status():
    """
    Check assessors on vacation and
    update their statuses
    """
    check_assessors_on_vacation()


@app.task
def update_google_sheets_task():
    """ Update table about assessors """
    update_sheet()
