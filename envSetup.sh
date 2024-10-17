#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

# Update package list and install PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Get the PostgreSQL version (automatically handles the version installed)
PG_VERSION=$(psql --version | awk '{print $3}' | cut -d '.' -f 1)

# Update PostgreSQL authentication method to use 'password' instead of 'peer'
sudo sed -i 's/host    all             all             127.0.0.1\/32            peer/host    all             all             127.0.0.1\/32            password/g' /etc/postgresql/$PG_VERSION/main/pg_hba.conf
sudo sed -i 's/host    all             all             ::1\/128                 peer/host    all             all             ::1\/128                 password/g' /etc/postgresql/$PG_VERSION/main/pg_hba.conf

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Optional: Print PostgreSQL status
sudo systemctl status postgresql
