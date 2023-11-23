import logging
import os
from typing import List, Any

import httplib2
from django.conf import settings
from django.db.models import QuerySet
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

from apps.fired.models import BlackList, Fired
from ..models import Assessor, AssessorState

GOOGLE_SHEETS_TABLE_ID = os.environ.get('GOOGLE_SHEETS_TABLE_ID')
SHEET_NAME = 'Исполнители TD'
CONFIG_FILENAME = 'config.json'


def _authorization():
    credentials = os.path.join(settings.BASE_DIR, f'../{CONFIG_FILENAME}')
    scopes_sheets = ['https://www.googleapis.com/auth/spreadsheets']
    credentials_sheets = (ServiceAccountCredentials
                          .from_json_keyfile_name(filename=credentials,
                                                  scopes=scopes_sheets)
                          .authorize(httplib2.Http()))
    service_sheets = build('sheets', 'v4', http=credentials_sheets)
    return service_sheets


def _get_assessors() -> QuerySet[Assessor]:
    return (Assessor.objects
            .select_related('manager')
            .prefetch_related('projects', 'second_manager')
            .order_by('manager__last_name', 'last_name'))


def _parse(assessors: QuerySet[Assessor]) -> List[List[Any]]:
    data = []
    for assessor in assessors:
        one_item = [assessor.full_name, assessor.username]
        manager = assessor.manager.full_name if assessor.manager else '-'
        one_item.append(manager)

        projects = assessor.projects.values_list('name', flat=True)
        projects_str = '; '.join(projects) if projects else '-'
        one_item.append(projects_str)

        state = AssessorState.get_value(assessor.state)
        one_item.append(state)

        second_managers = [manager.full_name for manager in assessor.second_manager.all()]
        second_managers_str = '; '.join(second_managers) if second_managers else '-'
        one_item.append(second_managers_str)

        if assessor.state in AssessorState.fired_states():
            model = BlackList if assessor.state == AssessorState.BLACKLIST else Fired
            try:
                obj = model.objects.get(assessor=assessor)
            except model.DoesNotExist:
                reason = '-'
            else:
                reason = obj.reason.title
        else:
            reason = '-'
        one_item.append(reason)

        data.append(one_item)

    return data


def _clear(spreadsheets) -> None:
    request_body = {
        'requests': [{
            'updateCells': {
                'range': {
                    'sheetId': 0,
                    'startRowIndex': 1,
                    'endRowIndex': 1000000
                },
                'fields': 'userEnteredValue'
            }
        }]
    }
    spreadsheets.batchUpdate(
        spreadsheetId=GOOGLE_SHEETS_TABLE_ID,
        body=request_body
    ).execute()


def _write(spreadsheets, values: List[List[Any]]) -> None:
    (spreadsheets
     .values()
     .update(spreadsheetId=GOOGLE_SHEETS_TABLE_ID,
             range=f'{SHEET_NAME}!A2',
             valueInputOption='RAW',
             body={'values': values})
     .execute())


def update_sheet():
    """ Update table about assessors """
    try:
        service_sheets = _authorization()
    except FileNotFoundError:
        logging.warning(f'Configuration file [{CONFIG_FILENAME}] not found. The task was skipped.')
    else:
        spreadsheets = service_sheets.spreadsheets()
        data = _parse(_get_assessors())
        _clear(spreadsheets)
        _write(spreadsheets, data)
