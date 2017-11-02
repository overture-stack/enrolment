"""enrol URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from core.login.google_login import GoogleLogin
from core import views

urlpatterns = [
    url(r'^$', views.schema_view),

    url(r'^admin/', admin.site.urls),
    url(r'^api/auth/', include('rest_auth.urls')),
    url(r'^api/auth/google/$', GoogleLogin.as_view(), name='google_login'),
    url(r'^api/auth/social/$', views.SocialViewSet),

    # Projects
    url(r'^api/projects/$', views.ProjectsViewSet.as_view(), name='projects'),
    url(r'^api/projects/([\w]{8}-[\w]{4}-4[\w]{3}-[\w][\w]{3}-[\w]{12})/$',
        views.ProjectsByIdViewSet),

    # Applications
    url(r'^api/applications/$', views.ApplicationsViewSet.as_view()),
    url(r'^api/applications/(?P<id>[\w]{8}-[\w]{4}-4[\w]{3}-[\w][\w]{3}-[\w]{12})/$',
        views.ApplicationsByIdViewSet),
    url(r'^api/projects/users/application/(?P<id>[\w]{8}-[\w]{4}-4[\w]{3}-[\w][\w]{3}-[\w]{12})/$',
        views.ProjectsUsersByIdViewSet),

    # Users
    url(r'^api/request/user/$', views.UserRequestViewSet),
    url(r'^api/request/user/check/(?P<id>[\w]{8}-[\w]{4}-4[\w]{3}-[\w][\w]{3}-[\w]{12})/$',
        views.UserRequestConfirmation),
    url(r'^api/projects/users/$', views.ProjectUsersViewSet.as_view()),
    url(r'^api/projects/users/(?P<project>[\w]{8}-[\w]{4}-4[\w]{3}-[\w][\w]{3}-[\w]{12})/$',
        views.ProjectsUsersByProjectViewSet),
]
