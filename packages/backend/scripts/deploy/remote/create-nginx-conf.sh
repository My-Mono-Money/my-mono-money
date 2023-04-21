#!/bin/bash
set -e
set -o pipefail

cd "my-mono-money/slots/$ENVIRONMENT_SLOT"
ENVIRONMENT_PORT=$(cat config/.env.local | grep ^PORT= | awk -F '=' '{print $2}')
SERVER_NAME=$(cat config/.env.local | grep ^BACKEND_APP_DOMAIN= | awk -F '=' '{print $2}' | sed 's/https:\/\///')
sed -i 's/$SERVER_NAME/'"$SERVER_NAME"'/' "$DEPLOYMENT_NAME/nginx.conf.template"
sed -i 's/$ENVIRONMENT_PORT/'"$ENVIRONMENT_PORT"'/' "$DEPLOYMENT_NAME/nginx.conf.template"
mv "$DEPLOYMENT_NAME"/nginx.conf{.template,}
