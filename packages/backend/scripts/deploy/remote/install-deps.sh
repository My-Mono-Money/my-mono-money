#!/bin/bash
set -e
set -o pipefail

cd "my-mono-money/slots/$ENVIRONMENT_SLOT/$DEPLOYMENT_NAME"
yarn install --prod
