#!/bin/bash

if [[ -f .env ]]; then
  export $(cat .env | xargs)
fi

BACKUP_FILE="database_backup.sql"

psql $DATABASE_URL < $BACKUP_FILE

echo "Restore completed"