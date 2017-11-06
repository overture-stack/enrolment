from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from core.models import Applications, Projects, UserRequest, ProjectUsers, STATUS_CHOICES

UserModel = get_user_model()


class UserDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = ('pk', 'username', 'email',
                  'first_name', 'last_name', 'is_staff')
        read_only_fields = ('email', 'is_staff', 'username')


class ChoicesField(serializers.Field):
    def __init__(self, choices, **kwargs):
        self._choices = choices
        super(ChoicesField, self).__init__(**kwargs)

    def to_representation(self, obj):
        return self._choices[obj][1]

    def to_internal_value(self, data):
        return self._choices[data][0]


class UserRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserRequest
        fields = ('id', 'project', 'email')


class ProjectUsersSerializer(serializers.ModelSerializer):
    status = ChoicesField(choices=STATUS_CHOICES)

    class Meta:
        model = ProjectUsers
        fields = ('id', 'project', 'user', 'firstname', 'lastname', 'agreementDate', 'agreementCheck', 'position',
                  'institution_name', 'institution_email', 'phone', 'daco_email', 'status', 'createdDate', 'updatedDate')


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = ('id', 'project', 'user', 'firstname', 'lastname', 'agreementDate', 'agreementCheck',
                  'position', 'institution_name', 'address', 'institution_email', 'phone', 'daco_email')


class ProjectsSerializer(serializers.ModelSerializer):
    status = ChoicesField(choices=STATUS_CHOICES)

    class Meta:
        model = Projects
        fields = ('id', 'user', 'project_name', 'status',
                  'createdDate', 'updatedDate')


class ProjectSerializer(serializers.ModelSerializer):
    applications = ApplicationSerializer(many=True, read_only=True)
    UserRequests = UserRequestSerializer(many=True, read_only=True)
    projectUsers = ProjectUsersSerializer(many=True, read_only=True)
    status = ChoicesField(choices=STATUS_CHOICES)

    class Meta:
        model = Projects
        fields = ('id', 'user', 'project_name', 'project_description', 'pi', 'status', 'createdDate', 'updatedDate',
                  'applications', 'UserRequests', 'projectUsers')


class UserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=100)
    projects = ProjectSerializer(many=True, read_only=True)
    applications = ApplicationSerializer(many=True, read_only=True)
    projectUsers = ProjectUsersSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'projects',
                  'applications', 'projectUsers')
