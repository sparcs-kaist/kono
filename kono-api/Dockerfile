FROM node:12
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

WORKDIR /usr/src/app

VOLUME /usr/src/app
VOLUME /usr/src/assets
VOLUME /usr/src/log

RUN npm i -g nodemon

EXPOSE 4000

CMD [ "/bin/sh", "-c", "NODE_ENV=production nodemon bundle.js > /usr/src/log/stdout.log 2> /usr/src/log/stderr.log" ]
