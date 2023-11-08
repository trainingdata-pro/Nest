import json
import os
import sys

from tqdm import tqdm

sys.path.append('../')
sys.path.append('../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.dev')

django.setup()

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
