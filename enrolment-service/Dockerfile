FROM alpine:3.9

# Initialize
WORKDIR /data/api
COPY requirements.txt /data/api/

# Setup
RUN apk update
RUN apk upgrade
RUN apk add --update python3 python3-dev py3-pip\
    postgresql-client postgresql-dev\
    build-base gettext

RUN pip3 install --no-cache -r requirements.txt

# Clean
RUN apk del -r python3-dev postgresql

# Prepare
COPY . /data/api/
RUN mkdir -p /var/log/gunicorn && mkdir -p /data/api/logs

# Entry
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
