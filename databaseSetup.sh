#!/bin/bash

# Set the DEBIAN_FRONTEND environment variable to noninteractive
export DEBIAN_FRONTEND=noninteractive 
export CHECKPOINT_DISABLE=1


# Echo environment variables for debugging in DB user creation
echo "DATABASE is: ${DATABASE}"
echo "DB_USERNAME is: ${DB_USERNAME}"
echo "DB_PASSWORD is: ${DB_PASSWORD}"


# Create PostgreSQL user and database
sudo -u postgres psql -c "CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE ${DATABASE};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DATABASE} TO ${DB_USERNAME};"
sudo -u postgres psql -c "ALTER DATABASE ${DATABASE} OWNER TO ${DB_USERNAME};"
