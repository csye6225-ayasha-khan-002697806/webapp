#!/bin/bash

set -e

export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

# Install prerequisites
sudo apt-get update
sudo apt-get install -y curl

# This script installs Node.js 

# Install Node.js (Using Node.js 18.x for Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt-get install -y nodejs



# Verify installation
node --version
npm --version
