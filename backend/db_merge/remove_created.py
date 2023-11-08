import json
import os
import sys

from tqdm import tqdm

sys.path.append('../')
sys.path.append('../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.dev')

django.setup()

from apps.assessors.models import Assessor
from apps.fired.models import BlackList
from apps.history.models import History

with open('created.json') as file:
    data = json.load(file)
    for user in tqdm(data):
        history = History.objects.filter(assessor__username=user).delete()
        bl = BlackList.objects.filter(assessor__username=user).delete()
        assessor = Assessor.objects.filter(username=user).delete()

