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
from apps.fired.models import Fired
from apps.history.models import History

with open('fired.json') as file:
    data = json.load(file)
    for username in tqdm(data):
        history = History.objects.filter(assessor__username=username).delete()
        fr = Fired.objects.filter(assessor__username=username).delete()
        assessor = Assessor.objects.filter(username=username).delete()

