#!/bin/bash
set -e

cp nginx.conf.template dist/nginx.conf

source .env.local

cd ./dist
sed -i '' 's/$SERVER_NAME/'"$SERVER_NAME"'/; s/$ENVIRONMENT_PORT/'"$ENVIRONMENT_PORT"'/' nginx.conf
cd -

echo "nginx.conf added to dist"