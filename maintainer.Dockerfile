FROM ubuntu:16.04
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

# Install and setup ssh
RUN apt-get update
RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# Create users
RUN adduser --gecos "" --disabled-password sysop
RUN usermod -G sudo sysop
RUN adduser --gecos "" --disabled-password wheel
RUN usermod -G sudo sysop

# Install node.js
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

# Install some commands
RUN apt-get install -y git
RUN apt-get install -y sudo
RUN apt-get install -y vim
RUN apt-get install -y mysql-client

# Add maintainer shell scripts
WORKDIR /usr/src/scripts
ADD src/ .
RUN chmod 764 /usr/src/scripts/*.sh

# Attach volumes
VOLUME /usr/src/api-production/dist
VOLUME /usr/src/app-production/build
VOLUME /usr/src/log/api-production
VOLUME /usr/src/log/nginx-production
VOLUME /usr/src/api-stage/dist
VOLUME /usr/src/app-stage/build
VOLUME /usr/src/log/api-stage
VOLUME /usr/src/log/nginx-stage
VOLUME /usr/src/judge
VOLUME /usr/src/judge-status/build

# Retrieve source files
WORKDIR /usr/src
RUN git clone https://github.com/sparcs-kaist/kono.git
WORKDIR /usr/src/kono
RUN git checkout production

# Setup kono-api
WORKDIR /usr/src/kono/kono-api
RUN npm install

# Setup kono-front
WORKDIR /usr/src/kono/kono-front
RUN npm install

# Setup kono-judge-status
WORKDIR /usr/src/kono/kono-judge-status
RUN npm install

WORKDIR /usr/src

EXPOSE 22

# Execute ssh daemon
CMD [ "/bin/sh", "-c", "/usr/src/scripts/deploy.sh && /usr/src/scripts/stage.sh && /usr/sbin/sshd -D" ]
