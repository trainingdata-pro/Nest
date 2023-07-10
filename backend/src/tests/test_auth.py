from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import Code
from users.utils import create_code
from .common import base_test_config as config


class AuthenticationTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.not_active_user_data = config.NOT_ACTIVE_USER_DATA
        cls.active_user_data = config.ACTIVE_USER_DATA
        cls.manager_data = config.MANAGER_DATA
        cls.not_active_user = config.create_test_user(**cls.not_active_user_data)
        cls.manager1 = config.create_test_manager(user=cls.not_active_user, **cls.manager_data)
        cls.active_user = config.create_test_user(**cls.active_user_data)
        cls.manager2 = config.create_default_manager()

    def setUp(self):
        self.data = {
            'username': 'test_username2',
            'password': 'test_password123',
            'email': 'test2@trainingdata.pro',
            'last_name': 'Petrov',
            'first_name': 'Petr',
            'middle_name': 'Petrovich'
        }

    def test_user_registration(self):
        url = reverse('user-list')
        response = self.client.post(url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_user = User.objects.get(username=self.data['username'])
        self.assertEqual(new_user.is_active, False)
        self.assertTrue('id' in response.data)
        self.assertTrue('last_name' in response.data)
        self.assertTrue('first_name' in response.data)
        self.assertTrue('middle_name' in response.data)
        self.assertTrue('is_operational_manager' in response.data)
        self.assertTrue('user' in response.data)
        self.assertTrue('operational_manager' in response.data)

    def test_user_activation(self):
        url = reverse('activate')
        code = create_code()
        correct = {'code': code}
        wrong = {'code': 'wrong_code'}
        Code.objects.create(code=code, user=self.not_active_user)

        response = self.client.post(url, wrong)
        user = User.objects.get(id=self.not_active_user.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('code' in response.data)
        self.assertEqual(user.is_active, False)

        response = self.client.post(url, correct)
        user = User.objects.get(id=self.not_active_user.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user.is_active, True)

    def test_signin(self):
        url = reverse('token_obtain_pair')
        data = {
            'username': self.active_user_data['username'],
            'password': self.active_user_data['password'],
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

