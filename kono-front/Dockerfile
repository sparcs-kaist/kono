FROM node:10
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

WORKDIR /usr/src/app
VOLUME /usr/src/app/build

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "build" ]
