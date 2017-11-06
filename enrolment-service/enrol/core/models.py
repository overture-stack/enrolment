import uuid
from django.contrib.auth.models import User
from django.db import models

STATUS_CHOICES = (
    (0, "Pending"),
    (1, "Approved"),
    (2, "Denied"),
)


class Projects(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=100)
    project_description = models.TextField()
    pi = models.CharField(max_length=200)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)
    createdDate = models.DateField(auto_now_add=True, auto_now=False)
    updatedDate = models.DateField(auto_now=True)

    class Meta:
        db_table = "projects"
        ordering = ['-id']


class Applications(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    agreementDate = models.DateField(auto_now_add=True, auto_now=False,)
    agreementCheck = models.BooleanField()
    position = models.CharField(max_length=50)
    institution_name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    institution_email = models.EmailField()
    daco_email = models.EmailField()

    class Meta:
        db_table = "applications"
        ordering = ['-id']


class ProjectUsers(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    agreementDate = models.DateField(auto_now_add=True, auto_now=False,)
    agreementCheck = models.BooleanField()
    position = models.CharField(max_length=50)
    institution_name = models.CharField(max_length=100)
    institution_email = models.EmailField()
    daco_email = models.EmailField()
    createdDate = models.DateField(auto_now_add=True, auto_now=False)
    updatedDate = models.DateField(auto_now=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)

    class Meta:
        db_table = "project_users"
        ordering = ['-id']


class UserRequest(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    email = models.EmailField()

    class Meta:
        db_table = "user_requests"
        ordering = ['-id']
