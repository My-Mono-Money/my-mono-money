#!/bin/bash

cd "my-mono-money/slots/$ENVIRONMENT_SLOT"
NUMBER=5
COUNT_DEPLOYMENTS=$(ls | grep deployment | wc -l)
OLDEST_DEPLOYMENT=$(ls | grep deployment | sort | head -n 1)

if [ "$COUNT_DEPLOYMENTS" -gt "$NUMBER" ]; then
  tar -czf "$OLDEST_DEPLOYMENT.tar.gz" -C "$OLDEST_DEPLOYMENT" .
  mv "$OLDEST_DEPLOYMENT.tar.gz" archive
  rm -rf "$OLDEST_DEPLOYMENT"
fi
