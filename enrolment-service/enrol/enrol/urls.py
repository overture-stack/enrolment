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
from rest_framework_nested import routers
from core.login.google_login import GoogleLogin
from core import views

router = routers.SimpleRouter()
router.register(r'projects', views.ProjectsViewSet, 'projects')
router.register(r'applications', views.ApplicationsViewSet, 'applications')

projects_router = routers.NestedSimpleRouter(
    router, r'projects', lookup='project')
projects_router.register(
    r'users', views.ProjectUsersViewSet, base_name='project-users')

urlpatterns = [
    url(r'^$', views.schema_view),
    url(r'^admin/', admin.site.urls),

    # Auth
    url(r'^api/v1/auth/', include('rest_auth.urls')),
    url(r'^api/v1/auth/google/$', GoogleLogin.as_view(), name='google_login'),
    url(r'^api/v1/auth/social/$', views.SocialViewSet),

    # Users
    url(r'^api/v1/request/user/$', views.UserRequestViewSet),
    url(r'^api/v1/request/user/check/(?P<id>[\w]{8}-[\w]{4}-4[\w]{3}-[\w][\w]{3}-[\w]{12})/$',
        views.UserRequestConfirmation),

    # Daco
    url(r'^api/v1/daco/$', views.daco),
    url(r'^api/v1/daco/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})/$',
        views.dacoAccess),

    # Django Rest Router + Nested Routers
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(projects_router.urls)),
]
