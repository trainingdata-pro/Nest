from datetime import timedelta
from typing import List

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assessors.models import AssessorState
from apps.assessors.services import assessors_service
from apps.fired.models import Fired, BlackList, Reason
from apps.projects.services import project_service
from core.utils import current_date
from .common import base_test_config as config
from .common import username_field


class AssessorsTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.manager_data = config.ACTIVE_MANAGER_DATA
        cls.manager = config.create_default_active_manager()
        cls.project_data = config.PROJECT_DATA
        cls.assessor_data = config.ASSESSOR_DATA
        cls.assessor_data2 = config.ASSESSOR_DATA2

    def setUp(self):
        self.token = config.get_auth_token(
            client=self.client,
            username=self.manager_data[username_field],
            password=self.manager_data['password']
        )

    def get_random_projects(self, count: int = 5) -> List[int]:
        projects = []
        for i in range(count):
            pr = project_service.create_project(name=f'project {i + 1}')
            project_service.set_manager(pr, managers=[self.manager])
            projects.append(pr.pk)
        return projects

    def get_fire_reason(self, blacklist: bool = False) -> Reason:
        return Reason.objects.create(
            title='reason',
            blacklist_reason=blacklist
        )

    def test_create_assessor(self):
        url = reverse('assessor-list')
        data = {
            'manager': self.manager.pk,
            **self.assessor_data
        }
        response = self.client.post(
            url,
            data=data
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.post(
            url,
            HTTP_AUTHORIZATION=self.token,
            data=data
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('id' in response.data)
        self.assertTrue('username' in response.data)
        self.assertTrue('last_name' in response.data)
        self.assertTrue('first_name' in response.data)
        self.assertTrue('middle_name' in response.data)

    def test_add_projects(self):
        assessor_detail_url = reverse(
            'assessor-detail',
            kwargs={'pk': self.assessor_data['id']}
        )
        config.create_test_assessor(manager=self.manager, **self.assessor_data)
        response = self.client.get(
            assessor_detail_url,
            HTTP_AUTHORIZATION=self.token
        )
        self.assertEqual(response.data['projects'], [])

        projects = self.get_random_projects()
        add_projects_url = reverse(
            'assessor-projects',
            kwargs={'pk': self.assessor_data['id']}
        )
        response = self.client.patch(
            add_projects_url,
            HTTP_AUTHORIZATION=self.token,
            data={'projects': projects}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('projects' in response.data)
        self.assertEqual(len(projects), len(response.data['projects']))
        self.assertEqual(response.data['state'], AssessorState.BUSY)

    def test_remove_projects(self):
        projects = self.get_random_projects()
        assessor = config.create_test_assessor(
            *projects,
            manager=self.manager,
            **self.assessor_data
        )
        old_projects = len(assessor.projects.all())
        projects2 = self.get_random_projects(count=2)
        url = reverse(
            'assessor-projects',
            kwargs={'pk': self.assessor_data['id']}
        )
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            kwargs={'pk': assessor.id},
            data={'projects': projects2}
        )
        self.assertTrue(old_projects != len(response.data['projects']))
        self.assertTrue(assessor.projects.filter(pk__in=projects2).exists())
        self.assertEqual(response.data['state'], AssessorState.BUSY)
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            kwargs={'pk': assessor.id},
            data={'projects': []}
        )
        self.assertTrue(len(response.data['projects']) == 0)
        self.assertEqual(response.data['state'], AssessorState.AVAILABLE)

    def test_fire(self):
        projects = self.get_random_projects()
        assessor = config.create_test_assessor(
            *projects,
            manager=self.manager,
            **self.assessor_data
        )
        url = reverse(
            'assessor-fire',
            kwargs={'pk': self.assessor_data['id']}
        )
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'reason': self.get_fire_reason().id}
        )
        self.assertEqual(response.status_code, 400)
        assessor.projects.clear()
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'reason': self.get_fire_reason().id}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['state'], AssessorState.FIRED)

        assessor2 = config.create_test_assessor(manager=self.manager, **self.assessor_data2)
        url = reverse(
            'assessor-fire',
            kwargs={'pk': assessor2.id}
        )
        response2 = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'reason': self.get_fire_reason(blacklist=True).id}
        )
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response2.data['state'], AssessorState.BLACKLIST)

    def test_free_resource(self):
        config.create_test_assessor(manager=self.manager, **self.assessor_data)
        url = reverse(
            'assessor-free-resource',
            kwargs={'pk': self.assessor_data['id']}
        )
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'free_resource': False}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('free_resource' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'free_resource': True}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('reason' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'free_resource': True, 'reason': 'free_time'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('free_resource_weekday_hours' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={
                'free_resource': True,
                'reason': 'free_time',
                'free_resource_weekday_hours': '2-4'
            }
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('free_resource_day_off_hours' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={
                'free_resource': True,
                'reason': 'free_time',
                'free_resource_weekday_hours': '2-4',
                'free_resource_day_off_hours': '0'
            }
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['state'], AssessorState.FREE_RESOURCE)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'free_resource': True}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('free_resource' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'free_resource': False}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['state'], AssessorState.AVAILABLE)
        self.assertEqual(response.data['free_resource_weekday_hours'], None)
        self.assertEqual(response.data['free_resource_day_off_hours'], None)

    def test_unpin(self):
        config.create_test_assessor(manager=self.manager, **self.assessor_data)
        url = reverse(
            'assessor-unpin',
            kwargs={'pk': self.assessor_data['id']}
        )
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('reason' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'reason': 'project'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['state'], AssessorState.FREE_RESOURCE)
        self.assertEqual(response.data['manager'], None)

    def test_vacation(self):
        config.create_test_assessor(manager=self.manager, **self.assessor_data)
        url = reverse(
            'assessor-vacation',
            kwargs={'pk': self.assessor_data['id']}
        )
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'vacation': False}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('vacation' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'vacation': True}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('vacation_date' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'vacation': True, 'vacation_date': current_date() + timedelta(days=5)}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['state'], AssessorState.VACATION)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'vacation': True, 'vacation_date': current_date() + timedelta(days=5)}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('vacation' in response.data)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data={'vacation': False}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['state'], AssessorState.AVAILABLE)
