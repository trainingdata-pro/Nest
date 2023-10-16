from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.assessors.services import assessors_service
from apps.projects.models import ProjectStatuses
from apps.projects.services import project_service
from .common import base_test_config as config, username_field


class ProjectsTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.active_project_data = config.ACTIVE_PROJECT_DATA
        cls.assessor1 = config.ASSESSOR_DATA
        cls.assessor2 = config.ASSESSOR_DATA2
        cls.user_data = config.ACTIVE_MANAGER_DATA
        cls.manager = config.create_default_active_manager()

    def setUp(self):
        self.token = config.get_auth_token(
            client=self.client,
            username=self.user_data[username_field],
            password=self.user_data['password']
        )

    def test_create_project(self):
        url = reverse('project-list')
        response = self.client.post(
            path=url,
            data={'name': 'new_project'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(
            path=url,
            HTTP_AUTHORIZATION=self.token,
            data={'manager': [self.manager.pk], **self.active_project_data}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('id' in response.data)
        self.assertTrue('asana_id' in response.data)
        self.assertTrue('name' in response.data)
        self.assertTrue('manager' in response.data)
        self.assertTrue('status' in response.data)
        self.assertTrue('date_of_creation' in response.data)
        self.assertTrue('tag' in response.data)

    def test_completed_project(self):
        project = project_service.create_project(**self.active_project_data)
        project = project_service.set_manager(project, [self.manager])
        assessor1 = assessors_service.create_assessor(manager=self.manager, **self.assessor1)
        assessor2 = assessors_service.create_assessor(manager=self.manager, **self.assessor2)
        assessor1.projects.set([project])
        assessor2.projects.set([project])
        url = reverse('project-detail', kwargs={'pk': project.pk})
        response = self.client.patch(
            path=url,
            HTTP_AUTHORIZATION=self.token,
            data={'status': ProjectStatuses.COMPLETED}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], ProjectStatuses.COMPLETED)
        self.assertEqual(project.assessors.count(), 0)
