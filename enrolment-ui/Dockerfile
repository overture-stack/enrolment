# Copyright 2020(c) The Ontario Institute for Cancer Research. All rights reserved.

FROM node:16 AS prebuilder

WORKDIR /data/web
COPY . /data/web/

# COPY CONFIG OVER
COPY ./docker-assets-config/config/config.js /data/web/src/config

# OVERWRITE ASSETS
COPY ./docker-assets-config/assets /data/web/src/assets

# BUILD
RUN yarn && \
    yarn build

CMD FOR_100_YEARS=$((100*365*24*60*60));while true;do sleep $FOR_100_YEARS;done
