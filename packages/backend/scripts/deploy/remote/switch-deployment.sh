#!/bin/bash

pm2 stop ~/ecosystem.config.js --only "my-mono-money-$ENVIRONMENT_SLOT-web" "my-mono-money-$ENVIRONMENT_SLOT-worker"
sudo service nginx configtest
cd "my-mono-money/slots/$ENVIRONMENT_SLOT"
rm current
ln -s "$DEPLOYMENT_NAME" current