#!/bin/bash

set -e
set -o pipefail

echo "Running migrations..."
cd my-mono-money/slots/$ENVIRONMENT_SLOT/current/ && node node_modules/.bin/typeorm --config typeorm-cli.config.js migration:run
echo "Migrations completed successfully"