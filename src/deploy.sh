#!/bin/bash

cd /usr/src/kono
git pull origin production
git checkout production

cd kono-api
npm install
npm run build
cp -r dist /usr/src/api-production
cd ..

cd kono-front
npm install
npm run build
cp -r build /usr/src/app-production
cd ..

cd kono-judge
cp -r requirements.txt /usr/src/judge
pip3 install -r requirements.txt
cp -r src /usr/src/judge
cd ..