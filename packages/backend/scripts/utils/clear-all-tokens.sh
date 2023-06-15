#!/bin/bash

if [[ -f .env ]]; then
  export $(cat .env | xargs)
fi

psql $DATABASE_URL -c "DELETE FROM transaction;"
psql $DATABASE_URL -c "DELETE FROM account;"
psql $DATABASE_URL -c "DELETE FROM space_member_invitation;"
psql $DATABASE_URL -c "DELETE FROM monobank_token_import_attempt;"
psql $DATABASE_URL -c "DELETE FROM monobank_token;"