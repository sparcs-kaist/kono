#!/bin/bash

DB_HOST=db_production
DB_PORT=3306
DB_DATABASE=kono
BACKUP_DIRECTORY=/usr/src/backup

usage="usage: $(basename "$0") [-h] [BACKUP_FILE_NAME]

where:
	-h			show this help text
	BACKUP_FILE_NAME	backup output file (optional, will be randomly generated if not given)"

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

# Create backup directory
mkdir -p ${BACKUP_DIRECTORY}

echo "Archiving ${DB_DATABASE} from ${DB_HOST}:"

if [ -z "$1" ]; then
	OUTPUT_FILE=$(openssl rand -hex 7).bk
else
	OUTPUT_FILE=$1
fi

mysqldump -h ${DB_HOST} -P ${DB_PORT} -u root ${DB_DATABASE} -p > ${BACKUP_DIRECTORY}/${OUTPUT_FILE}
echo "Backup file created at ${BACKUP_DIRECTORY}/${OUTPUT_FILE}"
