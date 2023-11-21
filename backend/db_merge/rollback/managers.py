import json
import os
import sys

from tqdm import tqdm

sys.path.append('../')
sys.path.append('../../')
sys.path.append('../../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.dev')

django.setup()

from apps.users.models import BaseUser
from core.users import UserStatus


managers = BaseUser.objects.filter(status=UserStatus.MANAGER)
data = []
for manager in tqdm(managers):
    data.append(
        {
            'username': manager.username,
            'email': manager.email,
            'full_name': manager.full_name,
            'date_of_registration': manager.date_joined.strftime('%Y-%m-%d'),
            'password': manager.password
        }
    )

with open('managers.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
