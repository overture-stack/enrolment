# Enrolment - QuickStart

The goal of this quick start is to get a working application quickly up and
running using docker-compose. This can be used as a demo or in production, the
following are requirements:

1. Google API credentials need to be setup via Google Cloud Console –
   [Instructions Here](https://developers.google.com/identity/sign-in/web/devconsole-project)

2. All users logging into the application via the Google sign-in require a DACO
   account, for more information visit
   [https://icgc.org/daco](https://icgc.org/daco)

3. Both config files (details below) need to be configured before running the
   initial `docker-compse` build command

---

## Step 1 - Config Files

There are two config template that need to be copied and completed. The first is
the env.template in the project root, the second is the config.template.js file
in enrolment-ui/docker-assets-config/config/config.template.js

### env.template –> .env

    .env
    enrolment-service/
    enrolment-ui/
    ...

#### Required Fields

##### Database

* `DB_NAME` - Setting used to setup Postgres Container
* `DB_USER` - Setting used to setup Postgres Container
* `DB_PASS` - Setting used to setup Postgres Container
* `DB_SERVICE` - Setting used to setup Postgres Container
* `DB_PORT` - Setting used to setup Postgres Container

##### Django Admin User

* `DJANGO_SUPER_USER` - Django admin user name
* `DJANGO_SUPER_MAIL` - Django admin user's email address
* `DJANGO_SUPER_PASS` - Password (recommend you delete this after initial setup)

##### ICGC Daco Credentials

* `ICGC_CLIENT_KEY` - Needed to interact with DACO Service
* `ICGC_CLIENT_SECRET` - Needed to interact with DACO Service
* `ICGC_TOKEN` - Needed to interact with DACO Service
* `ICGC_TOKEN_SECRET` - Needed to interact with DACO Service
* `ICGC_BASE_URL` - Needed to interact with DACO Service

##### SMPT Setup

* `SMTP_URL` - DNS Server IP or DNS
* `SMTP_FROM` - Email address to be used as sender for all notifications
* `RESOURCE_ADMIN_EMAIL` - Email to recieve admin notifications (ex. new project
  created)

#### Optional Fields

##### Debug/Logs

* `DEBUG` - Whether or not to run django in debug mode
* `DJANGO_LOG_LEVEL` - Controls the log level coming from Django: _ DEBUG: Low
  level system information for debugging purposes _ INFO: General system
  information _ WARNING: Information describing a minor problem that has
  occurred. _ ERROR: Information describing a major problem that has
  occurred. \* CRITICAL: Information describing a critical problem that has
  occurred.

### config.template.js –> config.js

    enrolment-service/
    enrolment-ui/
    	|__ config/
       		|__ docker-assets-config/
       	  		|__ assets/
    	      	|__ config/
                 	|__ config.template.js
    	         	|__ config.js
    ...
