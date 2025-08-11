#!/bin/bash

# Load NVM for this shell
export NVM_DIR="/usr/local/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 22
nvm use 22

# Navigate to the application directory
cd /home/ubuntu/Chakraview-Parent-App-main

# Install dependencies
if [ -f package.json ]; then
  npm install
else
  echo "Error: package.json not found in /home/ubuntu/Chakraview-Parent-App-main"
  exit 1
fi
