#!/bin/bash

AVAILABLE_ENVIRONMENT_SLOTS=("development" "staging" "production")
ENVIRONMENT_SLOT=$1
VM_NAME="do-webapps"
DEPLOYMENT_NAME="deployment-$(date +'%Y-%m-%d-%H-%M-%S')"

if [[ ! " ${AVAILABLE_ENVIRONMENT_SLOTS[*]} " =~ " ${ENVIRONMENT_SLOT} " ]]; then
  echo "Unknown environment slot: ${ENVIRONMENT_SLOT}, available environment slots are: ${AVAILABLE_ENVIRONMENT_SLOTS[@]}"
  exit 1
fi

scp dist.tar.gz "$VM_NAME:~/my-mono-money/slots/$ENVIRONMENT_SLOT"

UNARCHIVECMD=$(cat <<UNARCHIVECMD
cd "my-mono-money/slots/$ENVIRONMENT_SLOT"
mkdir "$DEPLOYMENT_NAME"
tar -xzf dist.tar.gz -C "$DEPLOYMENT_NAME"
cp config/.env.local "$DEPLOYMENT_NAME"
rm dist.tar.gz
UNARCHIVECMD
)
echo "$UNARCHIVECMD"
echo "$UNARCHIVECMD" | ssh "$VM_NAME"

INSTALLDEPSCMD=$(cat <<INSTALLDEPSCMD
cd "my-mono-money/slots/$ENVIRONMENT_SLOT/$DEPLOYMENT_NAME"
yarn install --prod
INSTALLDEPSCMD
)
echo "$INSTALLDEPSCMD"
echo "$INSTALLDEPSCMD" | ssh "$VM_NAME"
