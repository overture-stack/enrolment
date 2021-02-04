from django.contrib.auth.models import User

'''
Creates super user and two normal users for use in tests setUp
'''


def createUsers(self):
    self.admin_user = User.objects.create_user(
        username='admin', email='admin@admin.com', password='top_secret')

    self.user = User.objects.create_user(
        username='user', email='user@asd.com', password='top_secret')

    self.user_2 = User.objects.create_user(
        username='user_2', email='user_2@asd.com', password='top_secret')

    self.admin_user.is_superuser = True
    self.admin_user.is_superuser = True
    self.user.is_superuser = False
    self.user_2.is_superuser = False
    self.user.is_staff = False
    self.user_2.is_staff = False

    self.admin_user.save()
    self.user.save()
    self.user_2.save()

    return (self.admin_user, self.user, self.user_2)


def createNewObjInstance(self, Model, base={}, overwrite={}, user=None):
    newInstance = {
        **base,
        **overwrite,
        'user': self.user if user is None else user
    }

    return Model.objects.create(**newInstance)
