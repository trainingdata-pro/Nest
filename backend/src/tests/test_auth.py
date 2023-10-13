from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.authapp.services import auth_service
from .common import base_test_config as config
from .common import username_field


user_model = get_user_model()


class AuthenticationTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.not_active_manager_data = config.NOT_ACTIVE_MANAGER_DATA
        cls.active_manager_data = config.ACTIVE_MANAGER_DATA
        cls.manager_profile_data = config.MANAGER_PROFILE_DATA
        cls.not_active_user = config.create_test_user(**cls.not_active_manager_data)
        cls.manager1 = config.create_test_manager_profile(user=cls.not_active_user, **cls.manager_profile_data)
        cls.active_user = config.create_test_user(**cls.active_manager_data)
        cls.manager2 = config.create_default_active_manager()

    def setUp(self):
        self.data = {
            'username': 'test_username2',
            'password': 'test_password123',
            'email': 'test2@trainingdata.pro',
            'status': 'manager',
            'last_name': 'Petrov',
            'first_name': 'Petr',
            'middle_name': 'Petrovich'
        }

    def test_user_registration(self):
        url = reverse('users-list')
        response = self.client.post(url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_user = user_model.objects.get(username=self.data['username'])
        self.assertEqual(new_user.is_active, False)
        self.assertTrue('id' in response.data)
        self.assertTrue('username' in response.data)
        self.assertTrue('last_name' in response.data)
        self.assertTrue('first_name' in response.data)
        self.assertTrue('middle_name' in response.data)
        self.assertTrue('email' in response.data)
        self.assertTrue('status' in response.data)

    def test_user_activation(self):
        url = reverse('activate')
        code = auth_service.create_code(user=self.not_active_user)
        correct = {'code': code.code}
        wrong = {'code': 'wrong_code'}

        response = self.client.post(url, wrong)
        user = user_model.objects.get(id=self.not_active_user.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('code' in response.data)
        self.assertEqual(user.is_active, False)

        response = self.client.post(url, correct)
        user = user_model.objects.get(id=self.not_active_user.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.is_active, True)

    def test_signin(self):
        url = reverse('token_obtain_pair')
        data = {
            f'{username_field}': self.active_manager_data[username_field],
            'password': self.active_manager_data['password'],
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

        refresh = response.data.get('refresh')
        url = reverse('token_refresh')

        response = self.client.post(url, {'refresh': refresh})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)

    def test_invalid_refresh(self):
        url = reverse('token_refresh')
        response = self.client.post(url, {'refresh': 'invalid_refresh_token_123'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
