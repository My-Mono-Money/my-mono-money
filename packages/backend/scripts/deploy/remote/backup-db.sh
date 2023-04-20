# #!/bin/bash

set -e

VM_NAME="do-webapps"
AVAILABLE_ENVIRONMENT_SLOTS=("development" "staging" "production")
ENVIRONMENT_SLOT=$1
backup_dir="db"
max_backups=5

if [[ ! " ${AVAILABLE_ENVIRONMENT_SLOTS[*]} " =~ " ${ENVIRONMENT_SLOT} " ]]; then
  echo "Unknown environment slot: ${ENVIRONMENT_SLOT}, available environment slots are: ${AVAILABLE_ENVIRONMENT_SLOTS[@]}"
  exit 1
fi

DATABASE_URL=$(ssh "$VM_NAME" "cd my-mono-money/slots/$ENVIRONMENT_SLOT/current && source .env.local && echo \$DATABASE_URL")
ssh "$VM_NAME" "cd my-mono-money/slots/$ENVIRONMENT_SLOT/current"

DEPLOYMENT_NAME="before-run-$(basename $(ssh $VM_NAME readlink -f my-mono-money/slots/$ENVIRONMENT_SLOT/current))"
TAR_NAME="$DEPLOYMENT_NAME.tar.gz"

# Check if a backup with the same name already exists
if ssh "$VM_NAME" test -f "my-mono-money/slots/$ENVIRONMENT_SLOT/$backup_dir/$TAR_NAME"; then
    # If it exists, add a version number to the file name
    version=1
    while ssh "$VM_NAME" test -f "my-mono-money/slots/$ENVIRONMENT_SLOT/$backup_dir/$DEPLOYMENT_NAME.v$version.tar.gz"; do
        ((version++))
    done
    TAR_NAME="$DEPLOYMENT_NAME.v$version.tar.gz"
fi

ssh "$VM_NAME" "cd my-mono-money/slots/$ENVIRONMENT_SLOT/current/ && pg_dump $DATABASE_URL > $DEPLOYMENT_NAME.sql && tar -czvf $TAR_NAME --exclude=$backup_dir $DEPLOYMENT_NAME.sql && mv $TAR_NAME ../$backup_dir/ && cd ../$backup_dir && backup_count=\$(ls -1q | wc -l) && if [ \$backup_count -gt $max_backups ]; then oldest_backup=\$(ls -t | tail -n 1) && rm \$oldest_backup; fi && cd ../current && rm $DEPLOYMENT_NAME.sql"

yarn typeorm migration:run