<h1 align="center"> Enrolment </h1> <br>

<p align="center">
  Simple UI and workflow to manage projects and users enrolment for your cloud environment
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#techstack)
- [Quick Start](#quickstart)

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

[Quickstart](docs/quickstart.md)
