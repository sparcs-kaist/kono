FROM mariadb:10.1.41-bionic
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

VOLUME /var/lib/mysql

# MySQL initial configuration
ADD config/*.sh /docker-entrypoint-initdb.d/
ADD config/*.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
