#!/bin/bash

# Set the DEBIAN_FRONTEND environment variable to noninteractive
export DEBIAN_FRONTEND=noninteractive 
export CHECKPOINT_DISABLE=1


# Update system packages and install unzip and zip
sudo apt update -y
sudo apt install -y unzip zip

# Create csye6225 group (force if it already exists)
sudo groupadd -f csye6225

# Create csye6225 user with no login shell
sudo useradd -g csye6225 -s /usr/sbin/nologin -d /opt/csye6225 -m csye6225

# Copy application artifact to /opt directory
# Replace "/tmp/webapp.zip" with the actual path to your application artifact
sudo cp /tmp/webapp.zip /opt/webapp.zip

# Unzip application to /opt directory
sudo unzip /opt/webapp.zip -d /opt/csye6225

# Change ownership and permissions of application directory to csye6225:csye6225
sudo chown -R csye6225:csye6225 /opt/csye6225
sudo chmod -R 755 /opt/csye6225


# Navigate to the application directory
cd /opt/csye6225 || exit

# Create the .env file with environment variables
env_values=$(cat <<END
PORT=$PORT
HOST=$HOST
DB_DIALECT=$DB_DIALECT
END
)

# Write environment variables to .env using tee with sudo
echo "$env_values" | sudo -u csye6225 tee /opt/csye6225/.env >/dev/null

# Change ownership of the .env file to csye6225
sudo chown csye6225:csye6225 /opt/csye6225/.env

# Echo environment variables for debugging in User setup
echo "PORT is: $PORT"
echo "HOST is: $HOST"
echo "DB_DIALECT is: $DB_DIALECT"

# Print a message indicating the .env file creation
echo ".env file created"
sudo cat /opt/csye6225/.env


# Install npm packages for the application as the csye6225 user
sudo -u csye6225 npm install --prefix /opt/csye6225 || exit 1
sudo -u csye6225 npm i --prefix /opt/csye6225 || exit 1
# Print a message indicating successful npm installation
echo "NPM packages installed successfully."