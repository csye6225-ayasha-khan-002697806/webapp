#!/bin/bash

sudo cp /opt/csye6225/nodeApp.service /etc/systemd/system/

# Reload systemd to pick up the changes
sudo systemctl daemon-reload

sudo systemctl start nodeApp.service
sudo systemctl enable nodeApp.service
sudo systemctl status nodeApp.service

# Optional: Wait for a few seconds and check logs if needed
sleep 5
echo "Checking logs for nodeApp.service:"
journalctl -u nodeApp.service -n 50 --no-pager
