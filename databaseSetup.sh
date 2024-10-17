#!/bin/bash

# Create PostgreSQL user and database
sudo -u postgres psql -c "CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE ${DATABASE};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DATABASE} TO ${DB_USERNAME};"
sudo -u postgres psql -c "ALTER DATABASE ${DATABASE} OWNER TO ${DB_USERNAME};"
