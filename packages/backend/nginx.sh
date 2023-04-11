#!/bin/bash
set -e

source .env.local


# create the folder if it doesn't exist
ssh -i $SSH_KEY $SSH_USER@$SSH_HOST "sudo -S mkdir -p /home/$SSH_DEPLOYUSER/my-mono-money/slots/$SERVER_NAME/current"

# copy the nginx template file to the server
scp -i $SSH_KEY nginx.template.conf $SSH_USER@$SSH_HOST:/home/$SSH_DEPLOYUSER/nginx.template.conf
ssh -i $SSH_KEY $SSH_USER@$SSH_HOST "sudo -S chmod 777 /home/$SSH_DEPLOYUSER/nginx.template.conf"

# Replace the environment variables in the nginx template file and copy it to the nginx config directory
ssh -i $SSH_KEY $SSH_USER@$SSH_HOST "sudo -S sed -i 's/\$SERVER_NAME/$SERVER_NAME/g; s/\$ENVIRONMENT_PORT/$ENVIRONMENT_PORT/g' /home/$SSH_DEPLOYUSER/nginx.template.conf && sudo -S cp /home/$SSH_DEPLOYUSER/nginx.template.conf  /home/$SSH_DEPLOYUSER/my-mono-money/slots/$SERVER_NAME/current/nginx.conf"

# Reload the nginx service
ssh -i $SSH_KEY $SSH_USER@$SSH_HOST "sudo -S systemctl reload nginx"