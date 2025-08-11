#!/bin/bash

# Load NVM for the current shell
export NVM_DIR="/usr/local/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 22
nvm use 22

# Fetch .env from Parameter Store and save it to the application directory
aws ssm get-parameter --name "/parent-app-ec2/.env" --region ap-south-1 --with-decryption --query "Parameter.Value" --output text > /home/ubuntu/Chakraview-Parent-App-main/.env

# Change directory to the application folder
cd /home/ubuntu/Chakraview-Parent-App-main

# Start the application using PM2
pm2 restart all || pm2 start app.js --name "chakraview-app"
