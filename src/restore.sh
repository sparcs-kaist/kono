#!/bin/bash

DB_HOST=db_production
DB_PORT=3306
DB_DATABASE=kono

usage="usage: $(basename "$0") [-h] [BACKUP_FILE_NAME]

where:
	-h			show this help text
	BACKUP_FILE_NAME	backup input file"

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

echo "Restoring database from $1:"
cat $1 | mysql -h ${DB_HOST} -P ${DB_PORT} -u root ${DB_DATABASE} -p
echo "Restore complete."
