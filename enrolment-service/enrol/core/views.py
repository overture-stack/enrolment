import os
import json
import logging
from core.models import Applications, BillingContact, Projects, ProjectUsers
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from jinja2 import Environment
from django.http.response import Http404, HttpResponseForbidden
from rest_framework import viewsets, status, mixins, permissions
from rest_framework_swagger.views import get_swagger_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from email.mime.text import MIMEText
from core.serializers import ProjectsSerializer, ProjectSerializer, ApplicationSerializer, ProjectUsersSerializer, UserDetailsSerializer
from core.client.daco import DacoClient, DacoException
from django.core.mail import EmailMultiAlternatives
from smtplib import SMTPException

schema_view = get_swagger_view(title='Enrolment API')
SITE_URL = settings.SITE_URL
RESOURCE_ADMIN_EMAIL = settings.RESOURCE_ADMIN_EMAIL

# Get an instance of a logger
logger = logging.getLogger('django')


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


class IsOwnerOrAdminAll(permissions.BasePermission):
    """
    Custom permissions that allow admin or owner
    permission to object on ALL HTTP verbs
    """

    def has_object_permission(self, request, view, obj):
        # If superuser allow
        if request.user.is_superuser:
            return True

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
    permission_classes = (IsAuthenticated, IsOwnerOrAdminAll)

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

    def perform_update(self, serializer):
        # Save the data
        project = serializer.save()

        # If Termination Reqeust
        if project.status == 3:
            project_users = ProjectUsers.objects.filter(project=project.id)
            project_users.update(status=3)
            project_user_list = list(project_users.values())

            email = {
                'to': RESOURCE_ADMIN_EMAIL,
                'cc': project.user.email,
                'subject': 'Project Termination Request from {} for project "{}"'.format(
                    project.user.email, project.project_name),
                'message': 'A request from email <strong>{}</strong> to terminate project <strong>"{}"</strong> has been initated. {}'.format(
                    project.user.email, project.project_name, project_user_email_text(project_user_list))
            }
            send_update_notification(email)
            # print(email) # for testing

        elif project.status == 4:
            project_users = ProjectUsers.objects.filter(project=project.id)
            project_users.update(status=4)
            email = {
                'to': project.user.email,
                'cc': RESOURCE_ADMIN_EMAIL,
                'subject': 'Project Termination Request complete for project "{}"'.format(
                    project.project_name),
                'message': 'The request from email <strong>{}</strong> to terminate project <strong>"{}"</strong> is now complete.'.format(
                    project.user.email, project.project_name)
            }
            send_update_notification(email)
            # print(email) # for testing

    def destroy(self, request, pk=None):
        user = request.user

        if user.is_superuser:
            logger.debug('Attempting to purge project %s', pk)

            try:
            # We have to check for billing contacts separately, since it cannot cascade
                logger.debug('Removing Billing Contact, if available')
                billingContactPurgeResults = None

                try:
                    application = Applications.objects.get(project=pk)

                except Exception as e:
                    logger.debug('This project is not connected to an application (aka Orphaned): %s', e)

                else:
                    try:
                        billingContact = application.billing_contact

                        if billingContact != None:
                            logger.debug('Found a Billing Contact. Purging it...')
                            billingContactPurgeResults = billingContact.delete()

                        else:
                            logger.debug('No Billing Contact found. Moving on...')

                    except Exception as e:
                        logger.debug('Something wrong getting Billing Contact: %s', e)

            # This is where the project itself is removed, along with its dependencies
                finally:
                    logger.debug('Purging project now...')
                    projectPurgeResults = Projects.objects.get(id=pk).delete()

                    logger.debug('Project %s purged succesfully!', pk)

                    if billingContactPurgeResults != None: # Add up the purge totals
                        logger.debug('Adding purged totals...')
                        tempCount = projectPurgeResults[0] + billingContactPurgeResults[0]
                        tempSummary = {
                            **projectPurgeResults[1],
                            **billingContactPurgeResults[1]
                        }

                        for key, value in tempSummary.items():
                            if key in projectPurgeResults[1] and key in billingContactPurgeResults[1]:
                                tempSummary[key] = value + projectPurgeResults[1][key]

                        projectPurgeResults = [tempCount, tempSummary]

                    return Response(projectPurgeResults)

            except Exception as e:
                logger.error('Something went wrong purging project: %s', e)
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


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
        project = Projects.objects.get(pk=application.project.id)

        data = {
            'First Name': application.firstname,
            'Last Name': application.lastname,
            'Position': application.position,
            'Institution': application.institution_name,
            'Institution Email': application.institution_email,
            'Institution Website': application.institution_website,
            'Phone Number': application.phone,
            'Address': application.street_address,
            'City': application.city,
            'Province/State': application.region,
            'Zip/Postal Code': application.postal_code,
            'Country': application.country,
            'DACO email': application.daco_email,
            'Invoice Consent': application.invoice_consent,
            'Application Date': application.createdDate,
            'Project Name': project.project_name,
            'Project Description': project.project_description,
            'ICGC Access': project.project_ICGC_access
        }

        if (application.billing_contact):
            data = {
                **data,
                'Billing Contact': application.billing_contact.contact_name,
                'Billing Address': application.billing_contact.street_address,
                'Billing City': application.billing_contact.city,
                'Billing Province/State': application.billing_contact.region,
                'Billing Country': application.billing_contact.country,
                'Billing Zip/Postal Code': application.billing_contact.postal_code
            }

        html_msg = Environment().from_string(open(os.path.join(settings.BASE_DIR, 'core/email_templates/resource_request.html')).read()).render(
            resource_type="Project Application",
            data=data.items(),
            link='view/project-application/{}'.format(
                application.id)
        )

        text_msg = 'A new Project Application has been recieved from {} {} for the project titled: {}'.format(
            application.firstname, application.lastname, project.project_name)

        # Send email to request admin review and cc applicant
        email_message = EmailMultiAlternatives(
            subject='Collaboratory - New Project from {} {}: {}'.format(
                application.firstname, application.lastname, project.project_name),
            body=text_msg,
            to=[RESOURCE_ADMIN_EMAIL, ],
            cc=[application.daco_email, ],
        )

        email_message.attach_alternative(html_msg, "text/html")

        send_email(email_message)


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

    def perform_update(self, serializer):
        # Save the data
        project_user = serializer.save()
        project = Projects.objects.get(pk=project_user.project.id)

        # Send Notification
        if project_user.status == 1:
            email = {
                'to': RESOURCE_ADMIN_EMAIL,
                'cc': project.user.email,
                'data': project_user,
                'subject': 'Project User Registration Recieved from {} {}'.format(
                    project_user.firstname, project_user.lastname),
                'message': '{} {} has completed their registration and is ready to be activated by IT'.format(
                    project_user.firstname, project_user.lastname)
            }
            send_update_notification(email)
        elif project_user.status == 2:
            email = {
                'to': project.user.email,
                'cc': RESOURCE_ADMIN_EMAIL,
                'data': project_user,
                'subject': 'Project User {} {} has been activated'.format(
                    project_user.firstname, project_user.lastname),
                'message': '{} {} has been activated by IT and is ready to use Collab'.format(
                    project_user.firstname, project_user.lastname)
            }
            send_update_notification(email)

    def perform_create(self, serializer):
        # Save the data
        project_users = serializer.save()

        # Send email to invited users (can be single or mutliple project users)
        if not isinstance(project_users, list):
            project_users = [project_users]

        for project_user in project_users:
            project = project_user.project

            text_msg = 'Your Principal Investigator {pi} has requested to enrol you to the Collaboratory'\
                ' project {name}. Please complete the online form after signing in with your account:' \
                ' https://{url}/register-user/{project_id}/{id}/'.format(id=project_user.id,
                                                                         name=project.project_name,
                                                                         url=SITE_URL,
                                                                         project_id=project.id,
                                                                         pi=project.pi)

            html_msg = Environment().from_string(open(os.path.join(settings.BASE_DIR, 'core/email_templates/user_request.html')).read()).render(
                id=project_user.id,
                name=project.project_name,
                project_id=project.id,
                pi=project.pi,
                url=SITE_URL
            )

            email_message = EmailMultiAlternatives(
                subject='Collaboratory - Enrolment to project {}'.format(
                    project.project_name),
                body=text_msg,
                to=[project_user.daco_email, ],
            )

            email_message.attach_alternative(html_msg, "text/html")

            send_email(email_message)

    @action(detail=True, url_path='reinvite')
    def resend_invite(self, serializer, pk=None, project_pk=None):
        project_user = self.get_object()
        project = Projects.objects.get(pk=project_user.project.id)

        # Send Notification
        if project_user.status == 0:
            text_msg = 'Your Principal Investigator {pi} has requested to enrol you to the Collaboratory'\
                ' project {name}. Please complete the online form after signing in with your account:' \
                ' https://{url}/register-user/{project_id}/{id}/'.format(id=project_user.id,
                                                                         name=project.project_name,
                                                                         url=SITE_URL,
                                                                         project_id=project.id,
                                                                         pi=project.pi)

            html_msg = Environment().from_string(open(os.path.join(settings.BASE_DIR, 'core/email_templates/user_request.html')).read()).render(
                id=project_user.id,
                name=project.project_name,
                project_id=project.id,
                pi=project.pi,
                url=SITE_URL
            )

            email_message = EmailMultiAlternatives(
                subject='Collaboratory - Enrolment to project {}'.format(
                    project.project_name),
                body=text_msg,
                to=[project_user.daco_email, ],
            )

            email_message.attach_alternative(html_msg, "text/html")

            try:
                email_message.send()
                return Response('Email resent successfully')

            except Exception as e:
                logger.error(str(e))
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return Response(status=status.HTTP_409_CONFLICT)


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


@api_view(['GET'])
@authentication_classes((SessionAuthentication, ))
@permission_classes((IsAuthenticated, ))
def uniqueProjectUserCheck(request, project, email):
    if request.user.is_authenticated():
        project_obj = Projects.objects.get(pk=project)
        existingProjectUsers = ProjectUsers.objects.filter(daco_email=email, project=project)

        isSameUser = project_obj.user.email == email
        isAlreadyProjectUser = len(existingProjectUsers) > 0

        if (isSameUser or isAlreadyProjectUser):
            return Response('Duplicate User Error', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('User OK', status=status.HTTP_200_OK)

    else:
        return HttpResponseForbidden()


def send_email(email_message):
    try:
        return email_message.send()
    except Exception as e:
        logger.error('Error: Unable to send email: ' + str(e))
        return e


def send_update_notification(email):
    html_msg = Environment().from_string(open(os.path.join(settings.BASE_DIR, 'core/email_templates/notification.html')).read()).render(
        message=email['message']
    )

    text_msg = email['message']

    email_message = EmailMultiAlternatives(
        subject=email['subject'],
        body=text_msg,
        to=[email['to'], ],
        cc=[email['cc'], ],
    )

    email_message.attach_alternative(html_msg, "text/html")

    send_email(email_message)


def project_user_email_text(project_users):
    if len(project_users) == 0:
        return "There are no project users associated with this project."

    user_list = ['<li>{} {} - {}</li>'.format(
        user['firstname'], user['lastname'], user['institution_email']) for user in project_users]
    return 'Below are the associated users for this project:<br/><ul>{}</ul>'.format(''.join(user_list))
