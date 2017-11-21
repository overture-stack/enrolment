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

    url = reverse('requests-user-list')

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

        self.testProjectId = self.testProject.id
        self.testProject.save()

        self.newUserRequest = {
            'project': self.testProject,
            'email': self.user.email
        }

        self.newUserRequestPlain = [{
            'project': self.testProjectId,
            'email': self.user.email
        },
        {   'project': self.testProjectId,
            'email': self.user_2.email
        }]

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
        self.assertEqual(UserRequest.objects.count(), 2)

    def test_get_userRequest_by_id(self):
        userRequest = self.create_test_userRequest()
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(
            reverse('requests-user-detail', args=[userRequest.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
