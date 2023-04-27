#!/bin/bash

AVAILABLE_ENVIRONMENT_SLOTS=("development" "staging" "production")
ENVIRONMENT_SLOT=$1
VM_NAME="do-webapps"
DEPLOYMENT_NAME="deployment-$(TZ=Europe/Kyiv date +'%Y-%m-%d-%H-%M-%S')"

set -e
set -o pipefail

if [[ ! " ${AVAILABLE_ENVIRONMENT_SLOTS[*]} " =~ " ${ENVIRONMENT_SLOT} " ]]; then
  echo "Unknown environment slot: ${ENVIRONMENT_SLOT}, available environment slots are: ${AVAILABLE_ENVIRONMENT_SLOTS[@]}"
  exit 1
fi

if [ ! -f dist.tar.gz ]
then
    echo "File dist.tar.gz not found. Run build".
    exit 1 
fi

scp dist.tar.gz "$VM_NAME:~/my-mono-money/slots/$ENVIRONMENT_SLOT"

cat ./scripts/deploy/remote/unarchive.sh
ssh "$VM_NAME" "ENVIRONMENT_SLOT=$ENVIRONMENT_SLOT DEPLOYMENT_NAME=$DEPLOYMENT_NAME bash -s" < ./scripts/deploy/remote/unarchive.sh

cat ./scripts/deploy/remote/create-nginx-conf.sh
ssh "$VM_NAME" "ENVIRONMENT_SLOT=$ENVIRONMENT_SLOT DEPLOYMENT_NAME=$DEPLOYMENT_NAME bash -s" < ./scripts/deploy/remote/create-nginx-conf.sh

cat ./scripts/deploy/remote/install-deps.sh
ssh "$VM_NAME" "ENVIRONMENT_SLOT=$ENVIRONMENT_SLOT DEPLOYMENT_NAME=$DEPLOYMENT_NAME bash -s" < ./scripts/deploy/remote/install-deps.sh

cat ./scripts/deploy/remote/archive-old.sh
ssh "$VM_NAME" "ENVIRONMENT_SLOT=$ENVIRONMENT_SLOT DEPLOYMENT_NAME=$DEPLOYMENT_NAME bash -s" < ./scripts/deploy/remote/archive-old.sh

cat ./scripts/deploy/remote/switch-deployment.sh
ssh "$VM_NAME" "ENVIRONMENT_SLOT=$ENVIRONMENT_SLOT DEPLOYMENT_NAME=$DEPLOYMENT_NAME bash -s" < ./scripts/deploy/remote/switch-deployment.sh

ssh "$VM_NAME" "ENVIRONMENT_SLOT=$ENVIRONMENT_SLOT DEPLOYMENT_NAME=$DEPLOYMENT_NAME bash -s" < ./scripts/deploy/remote/backup-db.sh

ssh "$VM_NAME" "ENVIRONMENT_SLOT=$ENVIRONMENT_SLOT bash -s" < ./scripts/deploy/remote/run-migration.sh

