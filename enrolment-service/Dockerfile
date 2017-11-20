FROM alpine

# Initialize
RUN mkdir -p /data/api
WORKDIR /data/api
COPY requirements.txt /data/api/

# Setup
RUN apk update
RUN apk upgrade
RUN apk add --update python3 python3-dev postgresql-client postgresql-dev build-base gettext
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# Clean
RUN apk del -r python3-dev postgresql

# Prepare
COPY . /data/api/
RUN mkdir -p /var/log/gunicorn && mkdir -p /data/api/logs

# Entry
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh