FROM python:3.8.1
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

# install npm
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install nodejs

# install nodemon
RUN npm i -g nodemon

VOLUME /usr/src/app
WORKDIR /usr/src/app

EXPOSE 7077
EXPOSE 7078

CMD [ "/bin/sh", "-c", "nodemon --watch src/ --watch requirements.txt -e py --exec \"pip3 install -r requirements.txt && python3 src/judge.py\"" ]
