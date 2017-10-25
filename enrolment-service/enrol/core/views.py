from core.models import Applications, Projects, UserRequest, ProjectUsers
from django.shortcuts import render
from django.http.response import Http404, HttpResponseForbidden
from rest_framework_swagger.views import get_swagger_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from core.serializers import ProjectSerializer, ApplicationSerializer, ProjectUsersSerializer

schema_view = get_swagger_view(title='Enrol API')

@api_view(['GET'])
@authentication_classes((SessionAuthentication, ))
@permission_classes((IsAuthenticated, ))
def SocialViewSet(request):
    user = request.user
    response = user.socialaccount_set.get(provider='google').extra_data
    return Response(response, status=status.HTTP_200_OK)


class ProjectsViewSet(APIView):
    """
    Handles the Projects entity for the API
    get - Get list of users based on current users permissions
    post - save new project
    put - update project
    """
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.is_superuser:
            serializer = ProjectSerializer(Projects.objects.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            user = request.user
            serializer = ProjectSerializer(Projects.objects.filter(user=user), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {"id": serializer.data.get('id')}
            return Response(response, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        if request.user.is_superuser:
            project = Projects.objects.get(pk=request.data.get('id'))
            serializer = ProjectSerializer(project, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response = {"id": serializer.data.get('id')}
                return Response(response, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return HttpResponseForbidden()


@api_view(['GET'])
@authentication_classes((SessionAuthentication, ))
@permission_classes((IsAuthenticated, ))
def ProjectsByIdViewSet(request, id):
    """
    Get single project by ID
    """
    try:
        serializer = ProjectSerializer(Projects.objects.get(pk=id))
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Projects.DoesNotExist:
        raise Http404("No Project matches the given query.")


class ApplicationsViewSet(APIView):
    """
    Reponsible for handling project applications
    get - list known applications based on user permissions
    post - submit a new application
    """
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.is_superuser:
            serializer = ApplicationSerializer(Applications.objects.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            user = request.user
            serializer = ApplicationSerializer(Applications.objects.filter(user=user), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {"id": serializer.data.get('id')}
            return Response(response, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes((SessionAuthentication, ))
@permission_classes((IsAuthenticated, ))
def ApplicationsByIdViewSet(request, id):
    """
    Get a single Application by ID
    """
    try:
        serializer = ApplicationSerializer(Applications.objects.get(pk=id))
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Applications.DoesNotExist:
        raise Http404("No Application matches the given query.")


class ProjectUsersViewSet(APIView):
    """
    Responsible for handling the creation and retrieval of users in projects
    get - lists users that the current logged in user can see
    post - save a new user to a project
    put - update a user in a project
    """
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.is_superuser:
            serializer = ProjectUsersSerializer(ProjectUsers.objects.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            user = request.user
            serializer = ProjectUsersSerializer(ProjectUsers.objects.filter(user=user), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProjectUsersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {"id": serializer.data.get('id')}
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if request.user.is_superuser:
            users = ProjectUsers.objects.get(pk=request.data.get('id'))
            serializer = ProjectUsersSerializer(users, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response = {"id": serializer.data.get('id')}
                return Response(response, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return HttpResponseForbidden()

