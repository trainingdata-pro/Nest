import json
import os
import sys

from tqdm import tqdm

sys.path.append('../')
sys.path.append('../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.dev')

django.setup()

from apps.users.models import BaseUser
from apps.projects.models import Project

ignore = [1, 2, 3, 4, 5, 6, 7]

Project.objects.exclude(manager__pk__in=ignore).delete()
BaseUser.objects.exclude(pk__in=ignore).delete()
