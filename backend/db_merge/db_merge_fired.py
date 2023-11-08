import json
import os
from enum import Enum

from openpyxl import load_workbook
import sys
from copy import copy

from tqdm import tqdm

sys.path.append('../')
sys.path.append('../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.dev')

django.setup()


from apps.assessors.services import assessors_service
from apps.assessors.models import AssessorState, Assessor
from apps.projects.models import Project
from apps.fired.models import Reason
from apps.fired.services import fired_service
from apps.users.models import BaseUser
from apps.history.services import history


class Action(Enum):
    MOVE = 'move_to_fired'
    CREATE = 'create_and_fire'


def get_fullname(string: str):
    l_name = None
    f_name = None
    m_name = None
    splt = string.split(' ')
    if len(splt) == 4:
        l_name = splt[0]
        f_name = splt[1]
        m_name = f'{splt[2]} {splt[3]}'
    elif len(splt) == 3:
        l_name, f_name, m_name = splt
    elif len(splt) == 2:
        l_name, f_name = splt
    elif len(splt) == 1:
        l_name = splt[0]

    return l_name, f_name, m_name


def get_valid_username(username: str) -> str:
    if 't.me' in username:
        username = username.split('t.me/')[-1]

    username = username.replace('@', '')

    return username.strip()


def get_action(value: str):
    if value.lower() in ('в сервисе не в ср и не в чс и без команды', 'в сервисе без команды в ср'):
        return Action.MOVE.value
    elif value.lower() == 'нету':
        return Action.CREATE.value
    else:
        raise ValueError(f'Invalid value {value}')


def collect_data():
    data = {}

    wb = load_workbook('fired.xlsx')
    for sh in wb.worksheets:
        values = sh.values
        for row in tqdm(values):
            if 'ФИО' in row or str(row[8]).lower() == 'работает в команде':
                continue

            full_name = row[0]
            if full_name is None:
                break

            last_name, first_name, middle_name = get_fullname(full_name)
            username = get_valid_username(row[1])
            last_manager = row[2]
            last_project = row[3]
            date = row[5]
            action = get_action(row[8])

            data[username] = {
                'last_name': last_name,
                'first_name': first_name,
                'middle_name': middle_name,
                'last_manager': last_manager,
                'last_project': last_project,
                'date': date.strftime('%Y-%m-%d'),
                'action': action
            }

    with open('fired.json', 'w') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


def merge_db():
    reason = Reason.objects.get(title__iexact='нет времени')

    with open('fired.json') as file:
        data = json.load(file)

    for username in tqdm(data):
        user_data = data[username]
        action = user_data['action']
        if action == Action.CREATE.value:
            last_name = user_data['last_name']
            first_name = user_data['first_name']
            middle_name = user_data['middle_name']
            last_manager = str(user_data['last_manager'])

            try:
                manager_first_name, manager_last_name = last_manager.split(' ')
            except ValueError:
                manager_first_name = manager_last_name = None

            try:
                manager = BaseUser.objects.get(
                    first_name__iexact=manager_first_name,
                    last_name__iexact=manager_last_name
                )
            except:
                manager = None

            assessor = assessors_service.create_assessor(
                username=username,
                last_name=last_name,
                first_name=first_name,
                middle_name=middle_name,
                manager=manager,
                state=AssessorState.AVAILABLE
            )
            history.new_assessor_history(
                assessor=assessor,
                user='-'
            )
            unpin_reason = reason.title
            state_reason = None
        elif action == Action.MOVE.value:
            assessor = Assessor.objects.get(username=username)
            unpin_reason = None
            state_reason = reason.title
        else:
            raise ValueError('Assessor not found.')

        # created.append(username)
        project_name = user_data['last_project']
        project_obj = Project.objects.filter(name=project_name)
        if project_obj.exists():
            pr = project_obj.first()
            instance_before_update = copy(assessor)
            assessor.projects.add(pr)
            assessor = assessors_service.check_and_update_state(assessor)
            history.updated_assessor_history(
                old_assessor=instance_before_update,
                new_assessor=assessor,
                user='-',
                old_projects=[],
                old_second_managers=[],
                reason=None
            )

        instance_before_update2 = copy(assessor)
        fired_service.fire(
            assessor,
            reason=reason
        )
        assessors_service.fire(assessor)
        history.updated_assessor_history(
            old_assessor=instance_before_update2,
            new_assessor=assessor,
            user='-',
            unpin_reason=unpin_reason,
            state_reason=state_reason,
            use_none_action_for_state=True
        )


if __name__ == '__main__':
    # collect_data()
    merge_db()
