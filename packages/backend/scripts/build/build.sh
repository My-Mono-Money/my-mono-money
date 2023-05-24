#!/bin/bash

set -e
set -o pipefail

echo "Starting building..."
cp ../../../../package.json root-package.json 

cp ../../package.json main-package.json

node mergePackageJson.js

cp package.json ../../dist

rm root-package.json main-package.json package.json

cd ../../

cp yarn.lock nginx.conf.template dist

tar -czf dist.tar.gz -C dist .

echo "Build script successfully."