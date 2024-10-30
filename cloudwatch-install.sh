#!/bin/bash

set -e 

wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent

sudo cp /tmp/cloudwatch-config.json /opt/csye6225/cloudwatch-config.json
sudo chmod 775 /opt/csye6225/cloudwatch-config.json
cd /opt/csye6225/ && sudo chown csye6225:csye6225 cloudwatch-config.json

echo "changed ownership of cloudwatch-config.json"

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/csye6225/cloudwatch-config.json \
    -s



sudo systemctl restart amazon-cloudwatch-agent