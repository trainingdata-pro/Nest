import json
import os
import sys
from copy import copy

from tqdm import tqdm

sys.path.append('../')
sys.path.append('../src')

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.config.settings.prod')

django.setup()

from apps.assessors.services import assessors_service
from apps.assessors.models import AssessorState, FreeResourceHours
from apps.projects.models import Project, ProjectStatuses
from apps.projects.services import project_service
from apps.fired.models import Reason
from apps.fired.services import blacklist_service, fired_service
from apps.users.models import BaseUser
from apps.history.services import history

IGNORE = []

with open('assessors.json') as a_file:
    assessors_info = json.load(a_file)

created = []

try:
    for assessor_pk in tqdm(assessors_info):
        assessor_data = assessors_info[assessor_pk]
        username = assessor_data['username']
        if username in IGNORE:
            continue

        last_name = assessor_data['last_name']
        if last_name is None:
            last_name = 'Unknown'

        first_name = assessor_data['first_name']
        if first_name is None:
            first_name = 'Unknown'

        middle_name = assessor_data['middle_name']

        manager = assessor_data['manager']

        is_free_resource = assessor_data['is_free_resource']
        blacklist = assessor_data['blacklist']

        current_project = assessor_data['current_project']
        second_manager = assessor_data['second_manager']

        if manager is not None:
            manager_username = manager['username']
            manager_obj = BaseUser.objects.get(username=manager_username)
            assessor = assessors_service.create_assessor(
                username=username,
                last_name=last_name,
                first_name=first_name,
                middle_name=middle_name,
                manager=manager_obj,
                state=AssessorState.AVAILABLE
            )
            created.append(assessor.username)
            history.new_assessor_history(
                assessor=assessor,
                user='-'
            )

            if current_project:
                for project in current_project:
                    projects_before_update = [pr.pk for pr in assessor.projects.all()]
                    second_managers_before_update = [man.pk for man in assessor.second_manager.all()]

                    pr_name = project['name']
                    pr_manager = project['manager']
                    pr_manager_obj = BaseUser.objects.get(username=pr_manager)

                    project_obj = Project.objects.filter(name=pr_name)
                    if not project_obj.exists():
                        print(f'NEW PROJECT: {pr_name}')
                        pr = project_service.create_project(
                            asana_id='default',
                            name=pr_name,
                            status=ProjectStatuses.ACTIVE
                        )
                        pr = project_service.set_manager(pr, [pr_manager_obj])
                    else:
                        pr = project_obj.first()

                    if pr_manager_obj.pk == manager_obj.pk:
                        instance_before_update = copy(assessor)
                        assessor.projects.add(pr)
                        assessor = assessors_service.check_and_update_state(assessor)
                        history.updated_assessor_history(
                            old_assessor=instance_before_update,
                            new_assessor=assessor,
                            user='-',
                            old_projects=projects_before_update,
                            old_second_managers=second_managers_before_update,
                            reason=None
                        )
                    else:
                        try:
                            s_manager_obj = BaseUser.objects.get(username=pr_manager)
                        except:
                            print(f'Second manager not found [{pr_manager}]')
                            continue

                        instance_before_update = copy(assessor)
                        assessor = assessors_service.to_free_resources(
                            assessor,
                            weekday_hours=FreeResourceHours.TWO_FOUR,
                            day_off_hours=FreeResourceHours.NULL
                        )
                        history.updated_assessor_history(
                            old_assessor=instance_before_update,
                            new_assessor=assessor,
                            user='-',
                            reason=None
                        )

                        instance_before_update2 = copy(assessor)
                        assessor = assessors_service.add_second_manager(
                            assessor,
                            manager=s_manager_obj,
                            project=pr
                        )

                        history.updated_assessor_history(
                            old_assessor=instance_before_update2,
                            new_assessor=assessor,
                            user='-',
                            old_projects=projects_before_update,
                            use_none_action_for_state=True
                        )

        else:
            bl_reason = Reason.objects.filter(blacklist_reason=True).first()
            f_reason = Reason.objects.get(blacklist_reason=False, title__iexact='нет времени')
            m_username = assessor_data['last_manager'] if blacklist else None
            try:
                manager = BaseUser.objects.get(username=m_username) if m_username else None
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
            created.append(assessor.username)
            history.new_assessor_history(
                assessor=assessor,
                user='-'
            )

            instance_before_update = copy(assessor)
            if is_free_resource:
                fired_service.fire(
                    assessor=assessor,
                    reason=f_reason
                )
                state_reason = f_reason.title
                unpin_reason = None
                to_blacklist = False
            elif blacklist:
                blacklist_service.blacklist(
                    assessor=assessor,
                    reason=bl_reason
                )
                unpin_reason = bl_reason.title
                state_reason = None
                to_blacklist = True
            else:
                print(f'Мертвая душа: [{username}]')
                fired_service.fire(
                    assessor=assessor,
                    reason=f_reason
                )
                state_reason = f_reason.title
                unpin_reason = None
                to_blacklist = False

            assessors_service.fire(assessor, to_blacklist=to_blacklist)
            history.updated_assessor_history(
                old_assessor=instance_before_update,
                new_assessor=assessor,
                user='-',
                state_reason=state_reason,
                unpin_reason=unpin_reason,
                use_none_action_for_state=True
            )
except Exception as ex:
    print(ex)

with open('created.json', 'w') as created_file:
    json.dump(created, created_file, indent=2, ensure_ascii=False)
