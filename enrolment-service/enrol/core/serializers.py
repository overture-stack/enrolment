from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from core.models import Applications, BillingContact, Projects, ProjectUsers, STATUS_CHOICES, USER_STATUS_CHOICES

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


class ProjectUsersSerializer(serializers.ModelSerializer):
    firstname = serializers.CharField(required=False, max_length=50)
    lastname = serializers.CharField(required=False, max_length=50)
    agreementDate = serializers.DateField(required=False)
    agreementCheck = serializers.BooleanField(required=False)
    position = serializers.CharField(required=False, max_length=50)
    institution_name = serializers.CharField(required=False, max_length=100)
    institution_email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False, max_length=50)
    status = ChoicesField(required=False, choices=USER_STATUS_CHOICES)

    class Meta:
        model = ProjectUsers
        fields = ('id', 'project', 'user', 'firstname', 'lastname', 'agreementDate', 'agreementCheck', 'position',
                  'institution_name', 'institution_email', 'phone', 'daco_email', 'status', 'createdDate', 'updatedDate')
        validators = [
            UniqueTogetherValidator(
                queryset=ProjectUsers.objects.all(),
                fields=('project', 'daco_email')
            )
        ]


class BillingContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingContact
        fields = (
            'id',
            'contact_name',
            'street_address',
            'city',
            'region',
            'country',
            'postal_code',
            'createdDate',
            'updatedDate'
        )


class ApplicationSerializer(serializers.ModelSerializer):
    billing_contact = BillingContactSerializer(required=False)

    class Meta:
        model = Applications
        fields = (
            'id',
            'project',
            'user',
            'firstname',
            'lastname',
            'agreementDate',
            'agreementCheck',
            'position',
            'institution_name',
            'institution_email',
            'phone',
            'street_address',
            'city',
            'region',
            'country',
            'postal_code',
            'daco_email',
            'billing_contact',
            'createdDate',
            'updatedDate'
        )

    def create(self, validated_data):
        billing_contact = validated_data.pop(
            'billing_contact') if 'billing_contact' in validated_data else False

        save_data = validated_data

        if (billing_contact):
            new_billing_contact = BillingContact.objects.create(
                **billing_contact)
            save_data = {
                'billing_contact': new_billing_contact,
                **validated_data
            }

        application = Applications.objects.create(**save_data)

        return application


class ProjectsSerializer(serializers.ModelSerializer):
    status = ChoicesField(choices=STATUS_CHOICES)

    class Meta:
        model = Projects
        fields = ('id', 'user', 'project_name', 'status',
                  'createdDate', 'updatedDate')


class ProjectSerializer(serializers.ModelSerializer):
    applications = ApplicationSerializer(many=True, read_only=True)
    projectUsers = ProjectUsersSerializer(many=True, read_only=True)
    status = ChoicesField(choices=STATUS_CHOICES)

    class Meta:
        model = Projects
        fields = ('id', 'user', 'project_name', 'project_description', 'pi', 'status', 'createdDate', 'updatedDate',
                  'applications', 'projectUsers')


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
