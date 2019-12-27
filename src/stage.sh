#!/bin/bash

cd /usr/src/kono
git pull origin master
git checkout master

cd kono-api
npm install
npm run build
cp -r dist /usr/src/api-stage
cd ..

cd kono-front
npm install
npm run build:staging
cp -r build /usr/src/app-stage
