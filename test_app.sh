#!/bin/bash

branchname=$1

if [ $branchname ]; then

  echo "pulling latest code changes from $branchname"
  git fetch
  git branch $branchname
  git reset --hard origin/$branchname

  echo "rebuilding the containers"
  docker-compose build

  echo "bringing down old app"
  docker-compose down -v

  echo "bringing up the new app"
  docker-compose up -d

else

  echo "forgot to pass a branch name to test"

fi
