from django.shortcuts import render
from rest_framework_swagger.views import get_swagger_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.response import Response

schema_view = get_swagger_view(title='Enrol API')


@api_view(['GET'])
@authentication_classes((SessionAuthentication, ))
@permission_classes((IsAuthenticated, ))
def SocialViewSet(request):
    user = request.user
    response = user.socialaccount_set.get(provider='google').extra_data
    return Response(response, status=status.HTTP_200_OK)
