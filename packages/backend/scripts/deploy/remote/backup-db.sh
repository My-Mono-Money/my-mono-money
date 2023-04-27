#!/bin/bash

set -e
set -o pipefail

backup_dir="db"
max_backups=5

source my-mono-money/slots/$ENVIRONMENT_SLOT/current/.env.local
echo $DATABASE_URL

DEPLOYMENT_NAME="before-run-$DEPLOYMENT_NAME"
TAR_NAME="$DEPLOYMENT_NAME.tar.gz"

# Check if a backup with the same name already exists
if test -f "my-mono-money/slots/$ENVIRONMENT_SLOT/$backup_dir/$TAR_NAME"; then
    # If it exists, add a version number to the file name
    version=1
    while test -f "my-mono-money/slots/$ENVIRONMENT_SLOT/$backup_dir/$DEPLOYMENT_NAME.v$version.tar.gz"; do
        ((version++))
    done
    TAR_NAME="$DEPLOYMENT_NAME.v$version.tar.gz"
fi

# Create a backup of the database and move it to the backup directory
cd my-mono-money/slots/$ENVIRONMENT_SLOT/current/ &&
pg_dump $DATABASE_URL > $DEPLOYMENT_NAME.sql &&
tar -czvf $TAR_NAME --exclude=$backup_dir $DEPLOYMENT_NAME.sql &&
mv $TAR_NAME ../$backup_dir/ &&
cd ../$backup_dir &&
backup_count=$(ls -1q | wc -l) &&
if [ $backup_count -gt $max_backups ]; then
    oldest_backup=$(ls -t | tail -n 1) &&
    rm $oldest_backup
fi &&
cd ../current &&
rm $DEPLOYMENT_NAME.sql

cd my-mono-money/slots/$ENVIRONMENT_SLOT/current/ && node node_modules/.bin/typeorm --config typeorm-cli.config.js migration:run