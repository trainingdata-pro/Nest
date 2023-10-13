# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APITestCase
#
# from .common import base_test_config as config
#
#
# class ProjectsTest(APITestCase):
#     @classmethod
#     def setUpTestData(cls):
#         cls.project_data = config.PROJECT_DATA
#         cls.user_data = config.ACTIVE_MANAGER_DATA
#         cls.manager = config.create_default_active_manager()
#         cls.project = config.create_test_project(owner=cls.manager, **cls.project_data)
#
#     def setUp(self):
#         self.test_user_data = {
#             'username': 'test',
#             'password': 'pass122333',
#             'email': 'test@trainingdata.pro'
#         }
#         self.test_user = config.create_test_user(**self.test_user_data)
#
#         self.test_manager_data = {
#             'last_name': 'Ivanov2',
#             'first_name': 'Ivan2',
#             'middle_name': 'Ivanovich2'
#         }
#         self.test_manager = config.create_test_manager(user=self.test_user, **self.test_manager_data)
#
#     def test_create_project(self):
#         url = reverse('project-list')
#         response = self.client.post(
#             path=url,
#             data={'name': 'new_project'}
#         )
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
#         token = config.get_auth_token(
#             client=self.client,
#             username=self.test_user_data['username'],
#             password=self.test_user_data['password']
#         )
#         response = self.client.post(
#             path=url,
#             HTTP_AUTHORIZATION=token,
#             data={'name': 'new_project'}
#         )
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue('id' in response.data)
#         self.assertTrue('name' in response.data)
#         self.assertTrue('owner' in response.data)
#         self.assertTrue('date_of_create' in response.data)
#
#     def test_get_edit_delete_project(self):
#         url = reverse('project-detail', kwargs={'pk': 123})
#         token = config.get_auth_token(
#             client=self.client,
#             username=self.user_data['username'],
#             password=self.user_data['password']
#         )
#         response = self.client.get(
#             path=url,
#             HTTP_AUTHORIZATION=token
#         )
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
#
#         url = reverse('project-detail', kwargs={'pk': self.project.pk})
#         response = self.client.get(
#             path=url,
#             HTTP_AUTHORIZATION=token
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#         url = reverse('project-detail', kwargs={'pk': self.project.pk})
#
#         new_name = 'new_name'
#         response = self.client.patch(
#             path=url,
#             HTTP_AUTHORIZATION=token,
#             data={'name': new_name}
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertTrue('name' in response.data)
#         self.assertEqual(response.data['name'], new_name)
#
#         response = self.client.delete(
#             path=url,
#             HTTP_AUTHORIZATION=token
#         )
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#
#     def test_can_edit_or_delete_project(self):
#         url = reverse('project-detail', kwargs={'pk': self.project.pk})
#         response = self.client.patch(
#             path=url,
#             data={'name': 'new_name'}
#         )
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
#         token = config.get_auth_token(
#             client=self.client,
#             username=self.test_user_data['username'],
#             password=self.test_user_data['password']
#         )
#         response = self.client.patch(
#             path=url,
#             HTTP_AUTHORIZATION=token,
#             data={'name': 'new_name'}
#         )
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
#         response = self.client.delete(
#             path=url,
#             HTTP_AUTHORIZATION=token
#         )
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
