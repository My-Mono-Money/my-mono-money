#!/bin/bash
set -e
set -o pipefail

cd "my-mono-money/slots/$ENVIRONMENT_SLOT"
mkdir "$DEPLOYMENT_NAME"
tar -xzf dist.tar.gz -C "$DEPLOYMENT_NAME"
cp config/.env.local "$DEPLOYMENT_NAME"
rm dist.tar.gz
