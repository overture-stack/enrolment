# Copyright 2017(c) The Ontario Institute for Cancer Research. All rights reserved.

FROM ubuntu:16.04
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install
RUN \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y build-essential libssl-dev && \
  apt-get install -y curl git man vim wget

# NODE & NPM
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
RUN source ~/.nvm/nvm.sh && nvm install 6.11.4 && npm install -g npm

# PREPARE
RUN mkdir -p /data/web
COPY . /data/web/

# BUILD
WORKDIR /data/web
RUN source ~/.nvm/nvm.sh && npm install && npm run build

CMD FOR_100_YEARS=$((100*365*24*60*60));while true;do sleep $FOR_100_YEARS;done