#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

export DEBIAN_FRONTEND=noninteractive
export CHECKPOINT_DISABLE=1

sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Load environment variables from the .env file
set -a
source /opt/csye6225/.env
set +a


# Start PostgreSQL service
sudo service postgresql start

# Create PostgreSQL user and database
sudo -u postgres psql -c "CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE ${DATABASE};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DATABASE} TO ${DB_USERNAME};"
sudo -u postgres psql -c "ALTER DATABASE ${DATABASE} OWNER TO ${DB_USERNAME};"
