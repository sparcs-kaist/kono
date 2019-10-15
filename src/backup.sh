#!/bin/bash

OUTPUT_FILE_DIRECTORY="./backup"
DB_ROOT_PASSWORD_FILE="./config/production/db_root_password"
DB_DATABASE="kono"
IMAGE_NAME="kono_db_production"

usage="usage: $(basename "$0") [-h] [BACKUP_FILE_NAME]

where:
	-h			show this help text
	BACKUP_FILE_NAME	backup output file, will be generated randomly if not provided"

while getopts ':h' option; do
  case "$option" in
    h) echo "$usage"
       exit
       ;;
    \?) printf "illegal option: -%s\n" "$OPTARG" >&2
	echo "$usage" >&2
	exit 1
	;;
  esac
done

# Find container.
container=$(docker ps -f name=${IMAGE_NAME}_* -q -n 1)
if [ -z "$container" ]; then
  echo "Could not find any active databases with image \"${IMAGE_NAME}\"."
  exit 1
fi

# Backup script.
echo "Archiving ${container}:"

if [ -z "$1" ]; then
  echo "No backup output file specified."
  OUTPUT_FILE=$(openssl rand -hex 7)
else
  OUTPUT_FILE=$1
fi

docker exec \
	${container} \
	/usr/bin/mysqldump -u root --password=$(cat ${DB_ROOT_PASSWORD_FILE}) ${DB_DATABASE} \
	> ${OUTPUT_FILE_DIRECTORY}/${OUTPUT_FILE}.bk

echo "Backup file created at ${OUTPUT_FILE_DIRECTORY}/${OUTPUT_FILE}.bk"
