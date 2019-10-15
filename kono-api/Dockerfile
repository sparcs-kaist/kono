FROM node:10
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE $PORT

CMD [ "npm", "run", "serve" ]
