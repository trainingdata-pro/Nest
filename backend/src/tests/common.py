from django.contrib.auth.models import User
from django.urls import reverse

from apps.assessors import Assessor
from apps.projects import Project
from apps.users import Manager


class BaseTestConfig:
    NOT_ACTIVE_USER_DATA = {
        'id': 1,
        'username': 'not_active',
        'password': 'test_password123',
        'email': 'not_active@trainingdata.pro',
        'is_active': False
    }

    ACTIVE_USER_DATA = {
        'id': 2,
        'username': 'active',
        'password': 'test_password123',
        'email': 'active@trainingdata.pro',
        'is_active': True
    }

    MANAGER_DATA = {
        'last_name': 'Ivanov',
        'first_name': 'Ivan',
        'middle_name': 'Ivanovich'
    }

    PROJECT_DATA = {
        'id': 1,
        'name': 'test project'
    }
    ASSESSOR_DATA = {
        'id': 1,
        'username': 'assessor',
        'last_name': 'Assessor',
        'first_name': 'Assessor',
        'middle_name': 'middle_name'
    }

    @staticmethod
    def create_test_user(**data):
        return User.objects.create_user(**data)

    def create_default_manager(self):
        user = self.create_test_user(**self.ACTIVE_USER_DATA)
        manager = self.create_test_manager(user=user, **self.MANAGER_DATA)

        return manager

    @staticmethod
    def create_test_manager(**data):
        return Manager.objects.create(**data)

    @staticmethod
    def create_test_project(**data):
        return Project.objects.create(**data)

    @staticmethod
    def create_test_assessor(*projects, **data):
        assessor = Assessor.objects.create(**data)
        if projects:
            assessor.projects.add(*projects)
            assessor.save()

        return assessor

    @staticmethod
    def get_auth_token(client, username, password):
        url = reverse('token_obtain_pair')
        response = client.post(url, {
            'username': username,
            'password': password
        })

        access = response.data.get('access')

        return f'Bearer {access}'


base_test_config = BaseTestConfig()
