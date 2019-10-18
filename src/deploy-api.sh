#!/bin/bash

# pull from branch
git pull origin production

# rebuild and run image
HOST_IP=$HOST_IP docker-compose up -d --build api

# cleanup
docker image prune -f
