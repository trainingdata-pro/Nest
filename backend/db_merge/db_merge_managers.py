import json
import os
import sys

from tqdm import tqdm

sys.path.append('../')
sys.path.append('../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.prod')

django.setup()

from apps.projects.services import project_service
from apps.projects.models import ProjectStatuses
from apps.users.services import user_service, profile_service
from core.users import UserStatus

TEAMLEAD = [3, 15, 7, 8]

with open('managers.json') as m_file:
    managers_info = json.load(m_file)

for manager_pk in tqdm(managers_info):
    manager_data = managers_info[manager_pk]
    pk = manager_data['manager_pk']
    is_teamlead = True if pk in TEAMLEAD else False
    password = manager_data['password']
    projects = manager_data['projects']

    new_user = user_service.create_user(
        is_active=True,
        username=manager_data['username'],
        email=manager_data['email'],
        first_name=manager_data['first_name'],
        last_name=manager_data['last_name'],
        status=UserStatus.MANAGER,
        password=password
    )

    profile = profile_service.create_profile(
        user=new_user,
        is_teamlead=is_teamlead
    )

    if projects:
        for project_data in projects:
            new_project = project_service.create_project(
                asana_id='default',
                name=project_data['name'],
                date_of_creation=project_data['date_of_creation'],
                status=ProjectStatuses.ACTIVE
            )
            project_service.set_manager(
                instance=new_project,
                managers=[new_user]
            )
