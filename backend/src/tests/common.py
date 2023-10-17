from django.contrib.auth import get_user_model
from django.test import Client
from django.urls import reverse

from apps.assessors.models import Assessor
from apps.assessors.services import assessors_service
from apps.projects.models import Project, ProjectStatuses
from apps.projects.services import project_service
from apps.users.models import BaseUser, ManagerProfile
from apps.users.services import user_service, profile_service
from core.users import UserStatus


user_model = get_user_model()
username_field = user_model.USERNAME_FIELD


class BaseTestConfig:
    NOT_ACTIVE_MANAGER_DATA = {
        'id': 1230,
        'username': 'not_active_manager',
        'password': 'test_password123',
        'email': 'not_active@trainingdata.pro',
        'last_name': 'Ivanov',
        'first_name': 'Ivan',
        'middle_name': 'Ivanovich',
        'status': UserStatus.MANAGER,
        'is_active': False
    }

    ACTIVE_MANAGER_DATA = {
        'id': 1240,
        'username': 'active_manager',
        'password': 'test_password123',
        'email': 'active@trainingdata.pro',
        'last_name': 'Petrov',
        'first_name': 'Petr',
        'middle_name': 'Petrovich',
        'status': UserStatus.MANAGER,
        'is_active': True
    }

    TEAMLEAD_DATA = {
        'id': 1250,
        'username': 'teamlead',
        'password': 'test_password123',
        'email': 'teamlead@trainingdata.pro',
        'last_name': 'Semenov',
        'first_name': 'Semen',
        'middle_name': 'Semenovich',
        'is_active': True
    }

    TEAMLEAD_PROFILE_DATA = {
        'is_teamlead': True
    }

    MANAGER_PROFILE_DATA = {
        'is_teamlead': False
    }

    ACTIVE_PROJECT_DATA = {
        'id': 1230,
        'asana_id': '1A',
        'name': 'active project',
        'status': ProjectStatuses.ACTIVE
    }
    ASSESSOR_DATA = {
        'id': 1230,
        'username': 'assessor',
        'last_name': 'AssessorLastName',
        'first_name': 'AssessorFirstName',
        'middle_name': 'AssessorMiddleName',
        'state': 'available'
    }
    ASSESSOR_DATA2 = {
        'id': 1240,
        'username': 'assessor2',
        'last_name': 'AssessorLastName',
        'first_name': 'AssessorFirstName',
        'middle_name': 'AssessorMiddleName',
        'state': 'available'
    }

    @staticmethod
    def create_test_user(**data) -> BaseUser:
        return user_service.create_user(**data)

    def create_default_active_manager(self) -> BaseUser:
        user = self.create_test_user(**self.ACTIVE_MANAGER_DATA)
        self.create_test_manager_profile(user=user, **self.MANAGER_PROFILE_DATA)
        return user

    @staticmethod
    def create_test_manager_profile(user: BaseUser, **data) -> ManagerProfile:
        return profile_service.create_profile(user, **data)

    @staticmethod
    def create_test_project(manager: BaseUser, **data) -> Project:
        project = project_service.create_project(**data)
        if manager:
            project_service.set_manager(project, [manager])

        return project

    @staticmethod
    def create_test_assessor(*projects, **data) -> Assessor:
        assessor = assessors_service.create_assessor(**data)
        if projects:
            assessor.projects.add(*projects)

        assessor = assessors_service.check_and_update_state(assessor)
        return assessor

    @staticmethod
    def get_auth_token(client: Client, username: str, password: str) -> str:
        url = reverse('token_obtain_pair')
        response = client.post(url, {
            f'{username_field}': username,
            'password': password
        })

        access = response.data.get('access')
        return f'Bearer {access}'


base_test_config = BaseTestConfig()
