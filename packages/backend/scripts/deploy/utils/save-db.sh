#!/bin/bash

if [[ -f .env ]]; then
  export $(cat .env | xargs)
fi
BACKUP_FILE="database_backup.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE

echo "Backup completed: $BACKUP_FILE"