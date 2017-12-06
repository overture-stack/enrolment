<h1 align="center"> Enrolment </h1> <br>

<p align="center">
    <img alt="GitPoint" title="GitPoint" src="https://github.com/overture-stack/enrolment/raw/feature/readme/docs/screenshot-register-project.png" width="480">
</p>

<p align="center">
  Simple UI and workflow to manage projects and users enrolment for your cloud environment
</p>



## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#techstack)
- [Quick Start](#quickstart)
  - [Step 1 - Config Files](#step-1---config-files)
  - [Step 2 - Docker Compose](#step-2---docker-compose)
  - [Step 3 - Social Application Config (Django Admin)](#step-3---social-application-config-django-admin)
  - [Step 4 - Run](#step-4---run)

## Introduction

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The app was created too replace PDF forms were previously sent to request projects (tenants) and users creation to our OpenStack cloud. It was designed to be simple and seamlessly connect to our existing ticketing system. To prevent security challenges and ensure all applications go through a documented approval workflows, the system does not actually create projects and users directly into OpenStack but create tickets processed by our team. This allow for greater customization (such as variations from default quotas) and provide us with the ability to ask more questions if necessary.

The system can be connected to [DACO](http://icgc.org/daco) to enforce permissions before project and users can be created, this verification step is optional since it is very specific to our domain.

Using the app, Principal Investigators can detail a reasearch project and request an OpenStack tenant to be created. Project that will be then reviewed by the team and created in our cloud environment. Once created, the PI can invite users to join their projects by mentioning their email address.

Users then receive an invitation and fill-out the registration form. Their cloud account will then be created by the team.

## Features

Here are some of the feature of the app:

* User-authentication through OpenID Connect (Google)
* Validate user DACO permissions (optional)
* Email-based workflows
* Admin role to approve projects and users
* Register and manage projects
* Register and manage users

## Tech Stack

The application is build with a ReactJS front-end, Django Rest
Framework powered back-end, and is easily deployable using Docker
(docker-compose).

## Quick Start

The goal of this quick start is to get a working application quickly up and running using docker-compose. This can be used as a demo or in production, the following are requirements:

1. Google API credentials need to be setup via Google Cloud Console – [Instructions Here](https://developers.google.com/identity/sign-in/web/devconsole-project)

2. All users logging into the application via the Google sign-in require a DACO account, for more information visit [https://icgc.org/daco](https://icgc.org/daco)

3. Both config files (details below) need to be configured before running the initial `docker-compse` build command

### Step 1 - Config Files

There are two config template that need to be copied and completed. The first is the env.template in the project root, the second is the config.template.js file in enrolment-ui/docker-assets-config/config/config.template.js

* The env.template becomes the .env file in the `/` root directory
* The config.template.js file becomes the config.js file in `enrolment-ui/docker-assets-config/config/`

#### env.template –> .env

    .env
    enrolment-service/
    enrolment-ui/
    ...

##### Required Fields

###### Database
* `DB_NAME` - Setting used to setup Postgres Container
* `DB_USER` - Setting used to setup Postgres Container
* `DB_PASS` - Setting used to setup Postgres Container
* `DB_SERVICE` - Setting used to setup Postgres Container
* `DB_PORT` - Setting used to setup Postgres Container

###### Django Admin User
* `DJANGO_SUPER_USER` - Django admin user name
* `DJANGO_SUPER_MAIL` - Django admin user's email address
* `DJANGO_SUPER_PASS` - Password (recommend you delete this after initial setup)

###### ICGC DACO Credentials
* `ICGC_CLIENT_KEY` - Needed to interact with DACO Service
* `ICGC_CLIENT_SECRET` - Needed to interact with DACO Service
* `ICGC_TOKEN` - Needed to interact with DACO Service
* `ICGC_TOKEN_SECRET` - Needed to interact with DACO Service
* `ICGC_BASE_URL` - Needed to interact with DACO Service

###### SMPT Setup
* `SMTP_URL` - DNS Server IP or DNS
* `SMTP_FROM` - Email address to be used as sender for all notifications
* `RESOURCE_ADMIN_EMAIL` - Email to receive admin notifications (ex. new project created)


##### Optional Fields

###### Debug/Logs
* `DEBUG` - Whether or not to run Django in debug mode
* `DJANGO_LOG_LEVEL` - Controls the log level coming from Django: 
  * DEBUG: Low level system information for debugging purposes
  * INFO: General system information
  * WARNING: Information describing a minor problem that has occurred.
  * ERROR: Information describing a major problem that has  occurred.
  * CRITICAL: Information describing a critical problem that has occurred.

#### config.template.js –> config.js
    enrolment-service/
    enrolment-ui/
		|__ config/
	   		|__ docker-assets-config/
	   	  		|__ assets/
    	      	|__ config/
	             	|__ config.template.js
    	         	|__ config.js
    ...
    
##### Required

* `clientId` - OAuth 2.0 client ID from https://console.cloud.google.com/apis/credentials?project=__YOUR_PROJECT_NAME__
* `multiLingual` - Enable/Disable language toggle in Application
* `peFullTerms` - Link to Project Enrolment terms and conditions (shown on last step of application)


### Step 2 - Docker Compose

With the config files completed you are ready to run docker-compose commands to build and run the applications. This assumes you have [docker](https://docs.docker.com/engine/installation/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your target machine.

`cd /path/to/your/project`

`sudo docker-compose build`

`sudo docker-compose up`


### Step 3 - Social Application Config (Django Admin)

As mentioned at the top of this doc, Google API credentials need to be setup in order for the login to work. Once that is setup you will have the necessary information to complete this step. The following will assume a `docker-compose` running on a local machine with the default port mapping setup in the compose file, you can substitute `localhost` for your URL/IP where applicable if this is running remote.

#### Create Social App in Django Admin + Google Cloud Console

1. In your browser to go `localhost:8000/admin`
2. Login with your admin credentials
3. Click the [Social applications](http://localhost:8000/admin/socialaccount/socialapp/) link at the bottom of the screen
4. Click the `ADD SOCIAL APPLICATION +` button
5. Complete the fields:
	* **Provider** - Google
	* **Name** - Any name you want to give this
	* **Client id** - From [google credentials](https://console.cloud.google.com/apis/credentials?project=__YOUR_PROJECT_NAME__)
	* **Secret key** - From [google credentials](https://console.cloud.google.com/apis/credentials?project=__YOUR_PROJECT_NAME__)
	* **Sites** - Select the only site there and click the arrow that places it into chosen
6. `Save`

#### Register Authorized JavaScript origins

1. Go to your Google Cloud console credentials page and click your application link
2. Add your domain information under Authorized JavaScript origins, in our case for this demo you would simply add `http://localhost`

### Step 4 - Run

At this point if you visit the front-end `http://localhost` you will see the login page, now ready to login and authorize DACO approved Gmail addresses as well as accepting internal logins using the Django admin login setup in the config



