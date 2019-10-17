#!/bin/bash

# pull from branch
git pull origin master

# rebuild and run image
docker-compose up -d --build api

# cleanup
docker image prune -f
