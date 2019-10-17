#!/bin/bash

# pull from master branch
git pull origin master

# rebuild and run image
docker-compose up -d --build app

# cleanup
docker image prune -f
