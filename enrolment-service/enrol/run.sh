#!/bin/bash
# Copyright 2017(c) The Ontario Institute for Cancer Research. All rights reserved.

service nginx restart
source /srv/enrolment-service/env/bin/activate

gunicorn -w 6 -b 0.0.0.0:8000 --chdir /srv/enrolment-service/enrol enrol.wsgi --access-logfile=/var/log/gunicorn/access.log --error-logfile=/var/log/gunicorn/error.log