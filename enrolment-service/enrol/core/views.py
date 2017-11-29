import os
import json
from core.models import Applications, Projects, ProjectUsers
from django.conf import settings
from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from jinja2 import Environment
from django.http.response import Http404, HttpResponseForbidden
from rest_framework import viewsets, status, mixins, permissions
from rest_framework_swagger.views import get_swagger_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from email.mime.text import MIMEText
from core.serializers import ProjectsSerializer, ProjectSerializer, ApplicationSerializer, ProjectUsersSerializer, UserDetailsSerializer
from core.client.daco import DacoClient, DacoException
import smtplib

schema_view = get_swagger_view(title='Enrol API')
SMTP_SERVER = smtplib.SMTP(settings.SMTP_URL, 25)
SMTP_FROM = settings.SMTP_FROM
RESOURCE_ADMIN_EMAIL = settings.RESOURCE_ADMIN_EMAIL


class CreateRetrieveViewSet(mixins.CreateModelMixin,
                            mixins.RetrieveModelMixin,
                            viewsets.GenericViewSet):
    """
    A viewset that provides `retrieve`, and `create` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.

    Also allows you to set different serializers for the various methods:

    serializers = {
        'default': serializers.Default,
        'list':    serializers.List,
        'detail':  serializers.Details,
        # etc.
    }
    """
    serializers = {
        'default': None,
    }

    def get_serializer_class(self):
        return self.serializers.get(self.action, self.serializers['default'])


class CreateListRetrieveUpdateViewSet(mixins.CreateModelMixin,
                                      mixins.ListModelMixin,
                                      mixins.RetrieveModelMixin,
                                      mixins.UpdateModelMixin,
                                      viewsets.GenericViewSet):
    """
    A viewset that provides `retrieve`, `create`, 'update', and `list` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.

    Also allows you to set different serializers for the various methods:

    serializers = {
        'default': serializers.Default,
        'list':    serializers.List,
        'detail':  serializers.Details,
        # etc.
    }
    """
    serializers = {
        'default': None,
    }

    def get_serializer_class(self):
        return self.serializers.get(self.action, self.serializers['default'])


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permissions that allow admin or owner
    permission to object on all HTTP verbs except PUT/PATCH
    which is only for admins
    """

    def has_object_permission(self, request, view, obj):
        # If superuser allow
        if request.user.is_superuser:
            return True

        # If repuest is PUT/PATCH require admin
        if request.method in ("PUT", "PATCH") and not request.user.is_superuser:
            return False

        # Instance must have an attribute named `user`.
        return obj.user == request.user


class IsOwnerOrAdminOrDacoWithUpdate(permissions.BasePermission):
    """
    Custom permissions that allow admin, owner, or daco_email holder access
    """

    def has_object_permission(self, request, view, obj):
        # If superuser allow
        if request.user.is_superuser:
            return True

        # If Daco Email in resource, allow email holder access
        if request.user.email == obj.daco_email:
            return True

        # Instance must have an attribute named `user`.
        return obj.user == request.user


class ProjectsViewSet(CreateListRetrieveUpdateViewSet):
    """
    Handles the Projects entity for the API
    """
    serializers = {
        'default': ProjectSerializer,
        'list':  ProjectsSerializer,
    }
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, IsOwnerOrAdmin)

    def get_queryset(self):
        """
        Return all if user is admin, else return only owned
        """
        user = self.request.user

        if user.is_superuser:
            return Projects.objects.all()

        return Projects.objects.order_by('-createdDate').filter(user=user)

    def retrieve(self, request, pk=None):
        """
        Return for admin,
        return for owner,
        return for user that is invited,
        404 everyone else
        """
        queryset = Projects.objects.all()

        user = self.request.user
        project = get_object_or_404(queryset, pk=pk)

        if user.is_superuser:
            serializer = ProjectSerializer(project)
            return Response(serializer.data)

        if user == project.user:
            serializer = ProjectSerializer(project)
            return Response(serializer.data)

        # Special case for invited user's
        user_invite_for_project = ProjectUsers.objects.filter(
            daco_email=user.email, project=pk)
        is_user_invited = len(user_invite_for_project) > 0
        if is_user_invited:
            serializer = ProjectSerializer(project)
            return Response(serializer.data)

        # Otherwise return 404
        return Response(status=status.HTTP_404_NOT_FOUND)


class ApplicationsViewSet(CreateListRetrieveUpdateViewSet):
    """
    Handles the Projects entity for the API
    """
    serializers = {
        'default': ApplicationSerializer,
    }
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, IsOwnerOrAdmin)

    def get_queryset(self):
        """
        Return all if user is admin, else return only owned
        """
        user = self.request.user

        if user.is_superuser:
            return Applications.objects.order_by('-createdDate').all()

        return Applications.objects.order_by('-createdDate').filter(user=user)

    def perform_create(self, serializer):
        # Save the data
        application = serializer.save()

        # # Send email to request admin review
        # msg = MIMEText(
        #     Environment().from_string(open(os.path.join(settings.BASE_DIR, 'core/email_templates/resource_request.html')).read()).render(
        #         resource_type="Project Application",
        #         data=serializer.data.items(),
        #         link='view/project-application/{}'.format(
        #             application.id)
        #     ), "html"
        # )
        # msg['Subject'] = 'Collaboratory - New Project Application'
        # msg['To'] = RESOURCE_ADMIN_EMAIL
        # msg['From'] = SMTP_FROM

        # SMTP_SERVER.send_message(msg)


class ProjectUsersViewSet(CreateListRetrieveUpdateViewSet):
    """
    Handles the Project Users entity for the API
    """
    serializers = {
        'default': ProjectUsersSerializer,
    }
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, IsOwnerOrAdminOrDacoWithUpdate)

    def get_queryset(self):
        """
        Return all if user is admin, else return only owned
        """
        user = self.request.user
        project_pk = self.kwargs['project_pk']

        if user.is_superuser:
            # on "all" do not filter by project
            if (project_pk == 'all'):
                return ProjectUsers.objects.all()

            return ProjectUsers.objects.filter(project=project_pk)

        # on "all" do not filter by project
        if (project_pk == 'all'):
            return ProjectUsers.objects.filter(Q(user=user) | Q(daco_email=user.email))

        return ProjectUsers.objects.filter(Q(project=project_pk), Q(user=user) | Q(daco_email=user.email))

    def list(self, request, project_pk=None):
        queryset = self.get_queryset()
        serializer = ProjectUsersSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, project_pk=None):
        project_user = self.get_object()
        serializer = ProjectUsersSerializer(project_user)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # Save the data
        project_users = serializer.save()

        # Send email to invited users
        for project_user in project_users:
            project = project_user.project

            msg = MIMEText(
                Environment().from_string(open(os.path.join(settings.BASE_DIR, 'core/email_templates/user_request.html')).read()).render(
                    id=project_user.id,
                    name=project.project_name,
                    project_id=project.id,
                    pi=project.pi
                ), "html"
            )
            msg['Subject'] = 'Collaboratory - Enrollment to project ' + \
                project.project_name
            msg['To'] = project_user.daco_email
            msg['From'] = SMTP_FROM
            SMTP_SERVER.send_message(msg)


@api_view(['GET'])
@authentication_classes((SessionAuthentication, ))
@permission_classes((IsAuthenticated, ))
def dacoCheck(request, email):
    if request.user.is_authenticated():
        dacoClient = DacoClient(base_url=settings.ICGC_BASE_URL,
                                client_key=settings.ICGC_CLIENT_KEY,
                                client_secret=settings.ICGC_CLIENT_SECRET,
                                token=settings.ICGC_TOKEN,
                                token_secret=settings.ICGC_TOKEN_SECRET)
        try:
            response = dacoClient.get_daco_status(email)
            return Response(response, status=status.HTTP_200_OK)
        except DacoException as err:
            if err.status_code == 403:
                return HttpResponseForbidden()
            else:
                return Response(err.message, status=status.HTTP_400_BAD_REQUEST)

    else:
        return HttpResponseForbidden()


@api_view(['GET'])
@authentication_classes((SessionAuthentication, ))
@permission_classes((IsAuthenticated, ))
def SocialViewSet(request):
    user = request.user
    response = user.socialaccount_set.get(provider='google').extra_data
    return Response(response, status=status.HTTP_200_OK)

    try:
        serializer = ProjectUsersSerializer(ProjectUsers.objects.get(pk=id))
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ProjectUsers.DoesNotExist:
        raise Http404("No Users matches the given query.")
