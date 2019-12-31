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

ADD requirements.txt .
ADD src/ src/

RUN pip3 install -r requirements.txt

EXPOSE 7077
EXPOSE 7078

CMD [ "/bin/sh", "-c", "ls && nodemon --watch src/ --exec \"python3 src/judge.py\"" ]