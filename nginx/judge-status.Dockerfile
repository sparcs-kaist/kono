FROM nginx:1.17.4
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

VOLUME /usr/share/nginx/html

ADD config/judge-status.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "/bin/bash", "-c", "nginx -g 'daemon off;'" ]