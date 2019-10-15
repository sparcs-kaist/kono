FROM mysql:8.0.17
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

# MySQL initial configuration
ADD data/config/*.sh /docker-entrypoint-initdb.d/
ADD data/config/*.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
