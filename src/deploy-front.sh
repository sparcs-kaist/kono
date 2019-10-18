#!/bin/bash

# pull from master branch
git pull origin production

# rebuild and run image
HOST_IP=$HOST_IP docker-compose up -d --build app

# cleanup
docker image prune -f
