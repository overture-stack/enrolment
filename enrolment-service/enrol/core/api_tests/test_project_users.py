# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APITestCase, APIClient
# from core.models import ProjectUsers, Projects
# from django.contrib.auth.models import User
# from core.serializers import ProjectUsersSerializer
# from helpers import createUsers, createNewObjInstance
# from datetime import date

# import json


# class ProjectUsersTest(APITestCase):

#     def setUp(self):

#         createUsers(self)

#         baseProjectData = {
#             'user': self.user.id,
#             'project_name': 'New Project',
#             'project_description': 'Loremm ipsum',
#             'pi': 'Test PI',
#             'status': 0,
#         }

#         secondProjectData = {
#             'user': self.user.id,
#             'project_name': 'Second Project',
#             'project_description': 'Dolor sit amer',
#             'pi': 'Second PI',
#             'status': 0,
#         }

#         self.testProject = createNewObjInstance(
#             self, Projects, baseProjectData)

#         self.secondProject = createNewObjInstance(
#             self, Projects, secondProjectData)

#         self.url = reverse('project-users-list', args=[self.testProject.id])

#         self.newProjectUser = {
#             'project': self.testProject.id,
#             'user': self.user.id,
#             'daco_email': 'user_2@asd.com',
#         }

#         self.userUpdate = {
#             'firstname': 'Firsty',
#             'lastname': 'Lastington',
#             'agreementDate': date.today(),
#             'agreementCheck': False,
#             'position': 'Overlord',
#             'institution_name': 'Cats Inc',
#             'institution_email': 'flastington@cats.inc',
#             'phone': '123-123-1234',
#             'status': 1,
#         }

#         self.list_response_set = set([
#             'id',
#             'project',
#             'user',
#             'firstname',
#             'lastname',
#             'agreementDate',
#             'agreementCheck',
#             'position',
#             'institution_name',
#             'institution_email',
#             'phone',
#             'daco_email',
#             'status',
#             'createdDate',
#             'updatedDate',
#         ])

#         self.single_response_set = set([
#             'id',
#             'project',
#             'user',
#             'firstname',
#             'lastname',
#             'agreementDate',
#             'agreementCheck',
#             'position',
#             'institution_name',
#             'institution_email',
#             'phone',
#             'daco_email',
#             'status',
#             'createdDate',
#             'updatedDate',
#         ])

#     def create_test_projectUser(self, projectUser={}, user=None):
#         return createNewObjInstance(self, ProjectUsers, self.newProjectUser, projectUser, user)

#     def test_ensure_auth(self):
#         """
#         Ensure we require auth on all HTTP verbs
#         """
#         get_list_response = self.client.get(self.url)
#         post_response = self.client.post(self.url, self.newProjectUser)
#         put_response = self.client.put(self.url, self.newProjectUser)
#         patch_response = self.client.patch(self.url, self.newProjectUser)
#         del_response = self.client.delete(self.url, self.newProjectUser)

#         self.assertEqual(get_list_response.status_code,
#                          status.HTTP_403_FORBIDDEN)
#         self.assertEqual(post_response.status_code, status.HTTP_403_FORBIDDEN)
#         self.assertEqual(put_response.status_code, status.HTTP_403_FORBIDDEN)
#         self.assertEqual(patch_response.status_code, status.HTTP_403_FORBIDDEN)

#         self.assertEqual(ProjectUsers.objects.count(), 0)

#     def test_create_projectUser(self):
#         """
#         Ensure we can create a new projectUser object.
#         """
#         user = User.objects.get(username='user')
#         client = APIClient()
#         client.force_authenticate(user=self.user)
#         response = client.post(self.url, self.newProjectUser)

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(ProjectUsers.objects.count(), 1)
#         self.assertEqual(ProjectUsers.objects.get(
#         ).daco_email, 'user_2@asd.com')
#         self.assertEqual(ProjectUsers.objects.get(
#         ).status, 0)

#     def test_patch_user_to_pending(self):
#         """
#         Ensure the invited user can patch and move to pending
#         """
#         projectUser = self.create_test_projectUser(
#             projectUser={'project': self.testProject})
#         client = APIClient()
#         client.force_authenticate(user=self.user_2)

#         response = client.patch(
#             reverse('project-users-detail', args=[self.testProject.id, projectUser.id]), self.userUpdate)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(ProjectUsers.objects.get(
#         ).status, 1)

#     def test_patch_user_to_active_by_admin(self):
#         """
#         Ensure the invited user can patch and move to pending
#         """
#         projectUser = self.create_test_projectUser(
#             projectUser={'project': self.testProject, **self.userUpdate})
#         client = APIClient()
#         client.force_authenticate(user=self.admin_user)

#         response = client.patch(
#             reverse('project-users-detail', args=[self.testProject.id, projectUser.id]), {'status': 2})

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(ProjectUsers.objects.get(
#         ).status, 2)

#     def test_get_projectUsers_list(self):
#         """
#         Ensure we can fetch a projectUsers
#         """
#         projectUser_1 = self.create_test_projectUser(
#             projectUser={'project': self.testProject})
#         projectUser_2 = self.create_test_projectUser(
#             projectUser={'firstname': 'Secundo', 'project': self.testProject})
#         client = APIClient()
#         client.force_authenticate(user=self.user)
#         response = client.get(self.url)

#         # Test Response Success
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(ProjectUsers.objects.count(), 2)

#         # Test Response Format
#         projectUsers_responce_obj = json.loads(response.content)[0]
#         self.assertEqual(self.list_response_set.issubset(
#             projectUsers_responce_obj), True)

#     def test_get_projectUsers_list_only_for_user(self):
#         '''
#         Ensure that we can only retrieve our projectUsers
#         '''
#         projectUser_1 = self.create_test_projectUser(
#             projectUser={'project': self.testProject})
#         projectUser_2 = self.create_test_projectUser(
#             projectUser={'firstname': 'Secundo', 'project': self.testProject}, user=self.user_2)

#         user = User.objects.get(username='user')
#         client = APIClient()
#         client.force_authenticate(user=self.user)
#         response = client.get(self.url)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(ProjectUsers.objects.count(), 2)
#         self.assertEqual(len(json.loads(response.content)), 1)

#     def test_get_projectUsers_list_all(self):
#         """
#         Ensure we can fetch a projectUsers
#         """
#         all_url = reverse('project-users-list', args=['all'])
#         projectUser_1 = self.create_test_projectUser(
#             projectUser={'project': self.testProject})
#         projectUser_2 = self.create_test_projectUser(
#             projectUser={'firstname': 'Secundo', 'project': self.secondProject})
#         user = User.objects.get(username='user')
#         client = APIClient()
#         client.force_authenticate(user=self.user)
#         response = client.get(all_url)

#         # Test Response Success
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(ProjectUsers.objects.count(), 2)

#     def test_get_projectUser_by_id(self):
#         projectUser = self.create_test_projectUser(
#             projectUser={'project': self.testProject})
#         user = User.objects.get(username='user')
#         client = APIClient()
#         client.force_authenticate(user=self.user)
#         response = client.get(
#             reverse('project-users-detail', args=[self.testProject.id, projectUser.id]))

#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_get_projectUser_by_id_only_for_user(self):
#         projectUser_1 = self.create_test_projectUser(
#             projectUser={'project': self.testProject})
#         projectUser_2 = self.create_test_projectUser(
#             projectUser={'firstname': 'Secundo', 'project': self.testProject}, user=self.user_2)

#         user = User.objects.get(username='user')
#         client = APIClient()
#         client.force_authenticate(user=self.user)
#         response = client.get(
#             reverse('project-users-detail', args=[self.testProject.id, projectUser_1.id]))
#         response_404 = client.get(
#             reverse('project-users-detail', args=[self.testProject.id, projectUser_2.id]))

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response_404.status_code, status.HTTP_404_NOT_FOUND)

#     def test_no_delete(self):
#         """
#         Ensure that a projectUser cannot be deleted via the API
#         """
#         projectUser = self.create_test_projectUser(
#             projectUser={'project': self.testProject})
#         user = User.objects.get(username='user')
#         client = APIClient()
#         client.force_authenticate(user=self.user)
#         response = client.delete(
#             reverse('project-users-detail', args=[self.testProject.id, projectUser.id]))
#         self.assertEqual(response.status_code,
#                          status.HTTP_405_METHOD_NOT_ALLOWED)

#     def test_archive_projectUser(self):
#         ''''
#         Ensure only a superuser can archive a projectUser
#         '''
#         pass
