# Copyright 2017(c) The Ontario Institute for Cancer Research. All rights reserved.

FROM ubuntu:16.04
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install
RUN \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y build-essential libssl-dev && \
  apt-get install -y curl git man vim wget && \
  apt-get install -y python3 virtualenv nginx libmysqlclient-dev

# NODE & NPM
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
RUN source ~/.nvm/nvm.sh && nvm install 6.11.4 && npm install -g npm

RUN mkdir -p /srv

ADD enrolment-service /srv/enrolment-service
ADD enrolment-ui /srv/enrolment-ui

# UI
WORKDIR /srv/enrolment-ui
RUN source ~/.nvm/nvm.sh && npm install && npm run build

# API
WORKDIR /srv/enrolment-service
RUN virtualenv -p python3 env
RUN source env/bin/activate && pip install -r requirements.txt && pip install gunicorn

# NGINX
RUN rm -f /etc/nginx/sites-enabled/default
ADD nginx/enrolment.conf /etc/nginx/sites-enabled/enrolment.conf

RUN mkdir -p /var/log/gunicorn && mkdir -p /srv/enrolment-service/logs

RUN ["chmod", "+x", "/srv/enrolment-service/enrol/run.sh"]
CMD ["/srv/enrolment-service/enrol/run.sh"]