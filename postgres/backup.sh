#!/bin/bash

# Get .env variables (we need the db name)
export $(cat ../.env | xargs)

# Save datetime
now=$(date +"%Y%m%dT%H%M%S")

# Dumb db to dumps folder
docker exec -u postgres enrolment_postgres_1 pg_dump -Fc $DB_NAME > dumps/db_$now.dump