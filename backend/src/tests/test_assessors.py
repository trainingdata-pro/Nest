from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from projects.models import Project
from .common import base_test_config as config


class AssessorsTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user_data = config.ACTIVE_USER_DATA
        cls.project_data = config.PROJECT_DATA
        cls.assessor_data = config.ASSESSOR_DATA
        cls.manager = config.create_default_manager()

    def setUp(self):
        self.token = config.get_auth_token(
            client=self.client,
            username=self.user_data['username'],
            password=self.user_data['password']
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

    def test_add_delete_projects(self):
        url = reverse(
            'assessor-detail',
            kwargs={'pk': self.assessor_data['id']}
        )
        url_get = reverse(
            'assessor-project-detail',
            kwargs={'pk': self.assessor_data['id']}
        )
        url_add_project = reverse(
            'assessor-project-detail',
            kwargs={'pk': self.assessor_data['id']}
        ) + 'add_project/'
        url_delete_project = reverse(
            'assessor-project-detail',
            kwargs={'pk': self.assessor_data['id']}
        ) + 'delete_project/'

        count = 5
        projects = []
        for i in range(count):
            projects.append(Project(name=f'project {i + 1}', owner=self.manager))

        Project.objects.bulk_create(projects)
        config.create_test_assessor(manager=self.manager, **self.assessor_data)

        response = self.client.get(
            url_get,
            HTTP_AUTHORIZATION=self.token
        )
        self.assertEqual(response.data['projects'], [])

        response = self.client.patch(
            url_add_project,
            HTTP_AUTHORIZATION=self.token,
            data={'projects': [pr.pk for pr in projects]}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('projects' in response.data)

        response = self.client.get(
            url,
            HTTP_AUTHORIZATION=self.token
        )
        self.assertTrue(len(response.data['projects']) == len(projects))

        data = {
            'all': False,
            'projects': [1]
        }
        response = self.client.patch(
            url_delete_project,
            HTTP_AUTHORIZATION=self.token,
            data=data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(
            url,
            HTTP_AUTHORIZATION=self.token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['projects']) == len(projects) - 1)

        data = {'all': True}
        response = self.client.patch(
            url_delete_project,
            HTTP_AUTHORIZATION=self.token,
            data=data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['projects']) == 0)

    def test_can_edit_delete_assessor(self):
        url = reverse('assessor-detail', kwargs={'pk': self.assessor_data['id']})
        self.assessor = config.create_test_assessor(manager=self.manager, **self.assessor_data)
        new_user_data = {
            'username': 'user',
            'email': 'user@trainingdata.pro',
            'password': '122333qwer',
            'is_active': True
        }
        new_user = config.create_test_user(**new_user_data)
        config.create_test_manager(
            last_name='test',
            first_name='test',
            middle_name='test',
            is_operational_manager=False,
            operational_manager=None,
            user=new_user
        )

        new_data = {
            'last_name': 'new',
            'first_name': 'new',
            'middle_name': 'new',
        }
        token = config.get_auth_token(
            client=self.client,
            username=new_user_data['username'],
            password=new_user_data['password']
        )
        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=token,
            data=new_data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(
            url,
            HTTP_AUTHORIZATION=self.token,
            data=new_data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['last_name'], new_data['last_name'])
        self.assertEqual(response.data['first_name'], new_data['first_name'])
        self.assertEqual(response.data['middle_name'], new_data['middle_name'])
