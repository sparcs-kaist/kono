FROM nginx:1.17.4
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

VOLUME /usr/share/nginx/html
VOLUME /usr/share/nginx/assets
VOLUME /var/log/nginx

ADD config/*.conf /etc/nginx/conf.d/

# Remove softlink of log files: default nginx image does it
RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
