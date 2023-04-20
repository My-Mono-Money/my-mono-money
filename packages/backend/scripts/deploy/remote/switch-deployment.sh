






sudo systemctl restart nginx
pm2 start ~/ecosystem.config.js --only "my-mono-money-$ENVIRONMENT_SLOT-web" "my-mono-money-$ENVIRONMENT_SLOT-worker"