import json
import os
import sys
from copy import copy

from django.db.models import Q
from tqdm import tqdm

sys.path.append('../')
sys.path.append('../../')
sys.path.append('../../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.dev')

django.setup()

from apps.assessors.models import Assessor, AssessorState
from apps.fired.models import BlackList
from apps.history.services import history


def parse_manager(obj: Assessor):
    if obj.manager:
        return {
            'pk': assessor.manager.pk,
            'username': assessor.manager.username
        }
    return None


def parse_sm(obj: Assessor):
    s_managers = []
    sm = obj.second_manager.all()
    if sm:
        for s_manager in sm:
            try:
                if s_manager.pk != obj.manager.pk:
                    s_managers.append({'pk': s_manager.pk, 'username': s_manager.username})
            except AttributeError:
                continue

    return s_managers


def parse_projects(obj: Assessor):
    projects = []
    pj = obj.projects.all()
    if pj:
        for p in pj:
            projects.append(
                {
                    'pk': p.pk,
                    'asana_id': p.asana_id,
                    'name': p.name,
                    'manager': p.manager.filter(~Q(username=None)).first().username}
            )

    return projects


def get_blacklist(obj: Assessor):
    bl = BlackList.objects.get(assessor=obj)
    lm = history.get_last_assessor_manager(obj)
    if lm:
        lm = lm.strip()

    lp = history.get_last_assessor_project(obj)
    if lp:
        lp = lp.strip()

    return {
        'date': bl.date.strftime('%Y-%m-%d'),
        'reason': bl.reason.title,
        'last_manager': lm,
        'last_project': lp
    }


assessors = Assessor.objects.all()
data = []
for assessor in tqdm(assessors):
    blist = get_blacklist(assessor) if assessor.state == AssessorState.BLACKLIST else None
    data.append(
        {
            'username': assessor.username,
            'full_name': assessor.full_name,
            'manager': parse_manager(assessor),
            'second_manager': parse_sm(assessor),
            'projects': parse_projects(assessor),
            'state': assessor.state,
            'date_of_registration': assessor.date_of_registration.strftime('%Y-%m-%d'),
            'blacklist': blist
        }
    )


with open('assessors.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
