#!/bin/sh

# Wait for Postgres to be up
until psql -h "postgres" -U "postgres" -c '\q'; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - starting up now"

# Start Enrolment API
/usr/bin/python3 /data/api/enrol/manage.py makemigrations
/usr/bin/python3 /data/api/enrol/manage.py migrate
/usr/bin/python3 /data/api/enrol/manage.py collectstatic --no-input
echo "from django.contrib.auth.models import User; User.objects.create_superuser('${DJANGO_SUPER_USER}', '${DJANGO_SUPER_MAIL}', '${DJANGO_SUPER_PASS}')" | /usr/bin/python3 /data/api/enrol/manage.py shell
/usr/bin/gunicorn -w 6 -b 0.0.0.0:8000\
    --log-file /var/log/gunicorn/api.log\
    --chdir /data/api/enrol\
    --log-level debug\
    --capture-output\
    --reload\
    enrol.wsgi enrol.wsgi
