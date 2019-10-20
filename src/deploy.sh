#!/bin/bash

cd /usr/src/kono
git pull origin production
git checkout production

cd kono-api
npm install
npm run build
cp -r dist /usr/src/api
cd ..

cd kono-front
npm install
npm run build
cp -r build /usr/src/app
cd ..
