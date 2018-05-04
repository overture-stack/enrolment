from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from core.models import Projects, ProjectUsers
from django.contrib.auth.models import User
from core.serializers import ProjectsSerializer, ProjectSerializer
from helpers import createUsers, createNewObjInstance

import json


class ProjectsTest(APITestCase):

    url = reverse('projects-list')

    def setUp(self):
        createUsers(self)

        self.newProject = {
            'user': self.user.id,
            'project_name': 'New Project',
            'project_description': 'Loremm ipsum',
            'pi': 'Test PI',
            'status': 0,
        }

        self.list_response_set = set([
            'id',
            'project_name',
            'status',
            'createdDate',
            'updatedDate'
        ])

        self.single_response_set = set([
            'id',
            'project_name',
            'project_description',
            'pi',
            'status',
            'createdDate',
            'updatedDate',
        ])

    def create_test_project(self, project={}, user=None):
        return createNewObjInstance(self, Projects, self.newProject, project, user)

    def create_project_user(self, projectUser={}):
        return createNewObjInstance(self, ProjectUsers, projectUser)

    def test_ensure_auth(self):
        """
        Ensure we require auth on all HTTP verbs
        """
        get_list_response = self.client.get(self.url)
        post_response = self.client.post(self.url, self.newProject)
        put_response = self.client.put(self.url, self.newProject)
        del_response = self.client.delete(self.url, self.newProject)

        self.assertEqual(get_list_response.status_code,
                         status.HTTP_403_FORBIDDEN)
        self.assertEqual(post_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(put_response.status_code, status.HTTP_403_FORBIDDEN)

        self.assertEqual(Projects.objects.count(), 0)

    def test_create_project(self):
        """
        Ensure we can create a new project object.
        """
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post(self.url, self.newProject)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Projects.objects.count(), 1)
        self.assertEqual(Projects.objects.get().project_name, 'New Project')

    def test_get_projects_list(self):
        """
        Ensure we can fetch a projects
        """
        project_1 = self.create_test_project()
        project_2 = self.create_test_project(
            {'project_name': 'Second Project'})
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(self.url)

        # Test Response Success
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Projects.objects.count(), 2)

        # Test Response Format
        projects_responce_obj = json.loads(response.content)['results'][0]
        self.assertEqual(self.list_response_set.issubset(
            projects_responce_obj), True)

    def test_get_projects_list_only_for_user(self):
        '''
        Ensure that we can only retrieve our projects
        '''
        project_1 = self.create_test_project()
        project_2 = self.create_test_project(
            {'project_name': 'Second Project'}, self.user_2)

        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Projects.objects.count(), 2)
        self.assertEqual(len(json.loads(response.content)['results']), 1)

    def test_get_project_by_id(self):
        project = self.create_test_project()
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(
            reverse('projects-detail', args=[project.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test Response Format
        project_responce_obj = response.data
        self.assertEqual(self.single_response_set.issubset(
            project_responce_obj), True)

    def test_get_project_by_id_only_for_user(self):
        project_1 = self.create_test_project()
        project_2 = self.create_test_project(
            {'project_name': 'Second Project'}, self.user_2)

        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(
            reverse('projects-detail', args=[project_2.id]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_only_for_owner_or_admin(self):
        '''
        Ensure owner or superuser can update a project
        '''
        project = self.create_test_project()

        updated_project = {
            **self.newProject,
            'status': 3
        }

        second_updated_project = {
            **self.newProject,
            'status': 4
        }

        # Create Project Users to test notification emails
        test_project_user = {
            'project': project,
            'user': self.user.id,
            'daco_email': 'user@asd.com',
            'firstname': 'Firsty',
            'lastname': 'Lastington',
            'institution_email': 'institute@email.com',
        }
        self.create_project_user(test_project_user)

        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put(
            reverse('projects-detail', args=[project.id]), updated_project)
        client.force_authenticate(user=self.admin_user)
        admin_response = client.put(
            reverse('projects-detail', args=[project.id]), second_updated_project)
        client.force_authenticate(user=self.admin_user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(admin_response.status_code, status.HTTP_200_OK)

    def test_no_delete(self):
        """
        Ensure that a project cannot be deleted via the API
        """
        project = self.create_test_project()
        user = User.objects.get(username='user')
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete(
            reverse('projects-detail', args=[project.id]))
        self.assertEqual(response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_archive_project(self):
        ''''
        Ensure only a superuser can archive a project
        '''
        pass
