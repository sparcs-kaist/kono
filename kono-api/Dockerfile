FROM node:10
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Create users
RUN adduser --gecos "" --disabled-password sysop
RUN usermod -G sudo sysop
RUN adduser --gecos "" --disabled-password wheel
RUN usermod -G sudo wheel

EXPOSE 4000

CMD [ "npm", "run", "serve" ]
