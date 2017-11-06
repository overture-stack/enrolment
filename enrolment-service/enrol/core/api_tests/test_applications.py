from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from core.models import Applications, Projects
from django.contrib.auth.models import User
from core.serializers import ApplicationSerializer
from helpers import createUsers, createNewObjInstance
from datetime import date

import json


class ApplicationsTest(APITestCase):

    url = reverse('applications-list')

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

        self.newApplication = {
            'project': self.testProject.id,
            'user': self.user.id,
            'firstname': 'Firsty',
            'lastname': 'Lastington',
            'agreementDate': date.today(),
            'agreementCheck': False,
            'position': 'Overlord',
            'institution_name': 'Cats Inc',
            'address': '123 Fake Street',
            'institution_email': 'flastington@cats.inc',
            'daco_email': 'fluffykins@gmail.com',
        }

        self.list_response_set = set([
            'id',
            'project',
            'user',
            'firstname',
            'lastname',
            'agreementDate',
            'agreementCheck',
            'position',
            'institution_name',
            'address',
            'institution_email',
            'daco_email',
        ])

        self.single_response_set = set([
            'id',
            'project',
            'user',
            'firstname',
            'lastname',
            'agreementDate',
            'agreementCheck',
            'position',
            'institution_name',
            'address',
            'institution_email',
            'daco_email',
        ])

    def create_test_application(self, application={}, user=None):
        return createNewObjInstance(self, Applications, self.newApplication, application, user)

    def test_ensure_auth(self):
        """
        Ensure we require auth on all HTTP verbs
        """
        get_list_response = self.client.get(self.url)
        post_response = self.client.post(self.url, self.newApplication)
        put_response = self.client.put(self.url, self.newApplication)
        del_response = self.client.delete(self.url, self.newApplication)

        self.assertEqual(get_list_response.status_code,
                         status.HTTP_403_FORBIDDEN)
        self.assertEqual(post_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(put_response.status_code, status.HTTP_403_FORBIDDEN)

        self.assertEqual(Applications.objects.count(), 0)

    def test_create_application(self):
        """
        Ensure we can create a new application object.
        """
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post(self.url, self.newApplication)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Applications.objects.count(), 1)
        self.assertEqual(Applications.objects.get(
        ).daco_email, 'fluffykins@gmail.com')

    def test_get_applications_list(self):
        """
        Ensure we can fetch a applications
        """
        application_1 = self.create_test_application(
            application={'project': self.testProject})
        application_2 = self.create_test_application(
            application={'firstname': 'Secundo', 'project': self.testProject})
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(self.url)

        # Test Response Success
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Applications.objects.count(), 2)

        # Test Response Format
        applications_responce_obj = json.loads(response.content)['results'][0]
        self.assertEqual(self.list_response_set.issubset(
            applications_responce_obj), True)

    def test_get_applications_list_only_for_user(self):
        '''
        Ensure that we can only retrieve our applications
        '''
        application_1 = self.create_test_application(
            application={'project': self.testProject})
        application_2 = self.create_test_application(
            application={'firstname': 'Secundo', 'project': self.testProject}, user=self.user_2)

        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Applications.objects.count(), 2)
        self.assertEqual(len(json.loads(response.content)['results']), 1)

    def test_get_application_by_id(self):
        application = self.create_test_application(
            application={'project': self.testProject})
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(
            reverse('applications-detail', args=[application.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_application_by_id_only_for_user(self):
        application_1 = self.create_test_application(
            application={'project': self.testProject})
        application_2 = self.create_test_application(
            application={'firstname': 'Secundo', 'project': self.testProject}, user=self.user_2)

        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(
            reverse('applications-detail', args=[application_2.id]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_only_for_admin(self):
        '''
        Ensure only a superuser can update a application
        '''
        application = self.create_test_application(
            application={'project': self.testProject})

        updated_application = {
            **self.newApplication,
            'status': 1
        }

        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put(
            reverse('applications-detail', args=[application.id]), updated_application)
        client.force_authenticate(user=self.admin_user)
        admin_response = client.put(
            reverse('applications-detail', args=[application.id]), updated_application)
        client.force_authenticate(user=self.admin_user)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_response.status_code, status.HTTP_200_OK)

    def test_no_delete(self):
        """
        Ensure that a application cannot be deleted via the API
        """
        application = self.create_test_application(
            application={'project': self.testProject})
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete(
            reverse('applications-detail', args=[application.id]))
        self.assertEqual(response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_archive_application(self):
        ''''
        Ensure only a superuser can archive a application
        '''
        pass
