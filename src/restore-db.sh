#!/bin/bash

DB_ROOT_PASSWORD_FILE="./config/production/db_root_password"
DB_DATABASE="kono"
IMAGE_NAME="kono_db_production"

usage="usage: $(basename "$0") [-h] [BACKUP_FILE_NAME]

where:
	-h			show this help text
	BACKUP_FILE_NAME	backup input file (required)"

while getopts ':h' option; do
  case "$option" in
    h) echo "$usage"
       exit
       ;;
    \?) printf "illegal option: -%s\n" "$OPTARG" >&2
	echo "$usage" >&2
	exit 1
  esac
done

if [ -z "$1" ]; then
  echo "No backup file provided."
  exit 1
fi

# Find container.
container=$(docker ps -f name=${IMAGE_NAME}_* -q -n 1)
if [ -z "$container" ]; then
  echo "Could not find any active databases with image \"${IMAGE_NAME}\""
  exit 1
fi

# Restore script.
echo "Restoring ${container} from \"$1\" ..."
cat $1 | docker exec -i ${container} \
	/usr/bin/mysql -u root --password=$(cat ${DB_ROOT_PASSWORD_FILE}) ${DB_DATABASE}
echo "Restored ${container} from \"$1\""
