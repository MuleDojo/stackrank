#!/usr/bin/env bash
apt-get update
apt-get install -y make g++ libssl-dev git
apt-get install -y build-essential
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
apt-get install -y nodejs
apt-get install -y mongodb
npm install bower -g
npm install pm2 -g
mongo --eval "db.getSiblingDB('stackrank').addUser('dev_user', '12345');"
