FROM nginx:1.17.4
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

ADD config/*.conf /etc/nginx/conf.d/

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
