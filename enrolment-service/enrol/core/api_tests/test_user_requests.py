from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from core.models import Projects, UserRequest
from django.contrib.auth.models import User
from core.serializers import UserRequestSerializer
from helpers import createUsers, createNewObjInstance
from datetime import date


import json


class UsersRequestsTest(APITestCase):

    def setUp(self):

        createUsers(self)

        baseProjectData = {
            'user': self.user.id,
            'project_name': 'New Project',
            'project_description': 'Loremm ipsum',
            'pi': 'Test PI',
            'status': 0,
        }

        self.testProject = createNewObjInstance(
            self, Projects, baseProjectData)

        self.url = '/api/v1/request/user/'

        self.newUserRequest = {
            'project': self.testProject,
            'email': self.user.email
        }

        self.newUserRequestPlain = {
            'project': self.testProject,
            'email': self.user.email
        }

    def create_test_userRequest(self, userRequest={}):
        data = {
            **self.newUserRequest,
            **userRequest
        }
        return UserRequest.objects.create(**data)

    def test_ensure_auth(self):
        """
        Ensure we require auth on all HTTP verbs
        """
        get_list_response = self.client.get(self.url)
        post_response = self.client.post(self.url, self.newUserRequestPlain)

        self.assertEqual(get_list_response.status_code,
                         status.HTTP_403_FORBIDDEN)
        self.assertEqual(post_response.status_code, status.HTTP_403_FORBIDDEN)

        self.assertEqual(UserRequest.objects.count(), 0)

    def test_create_userRequest(self):
        """
        Ensure we can create a new userRequest object.
        """
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post(self.url, self.newUserRequestPlain)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserRequest.objects.count(), 1)

    def test_get_userRequest_by_id(self):
        UserRequest = self.create_test_userRequest()
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(self.url + str(self.testProjectId))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_get_projectUser_by_id_only_for_user(self):
    #     projectUser_1 = self.create_test_projectUser(
    #         projectUser={'project': self.testProject})
    #     projectUser_2 = self.create_test_projectUser(
    #         projectUser={'firstname': 'Secundo', 'project': self.testProject}, user=self.user_2)

    #     user = User.objects.get(username='user')
    #     client = APIClient()
    #     client.force_authenticate(user=self.user)
    #     response = client.get(
    #         reverse('project-users-detail', args=[self.testProject.id, projectUser_1.id]))
    #     response_404 = client.get(
    #         reverse('project-users-detail', args=[self.testProject.id, projectUser_2.id]))

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response_404.status_code, status.HTTP_404_NOT_FOUND)
