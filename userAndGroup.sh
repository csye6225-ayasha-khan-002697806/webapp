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

# Switch to csye6225 user and execute commands as that user
sudo -u csye6225 bash <<'EOF'

# Commands to be executed as csye6225 user
# Navigate to the application directory
cd /opt/csye6225 || exit

# Create .env file and write environment variables into it
env_values=$(cat <<END
PORT=$PORT
DATABASE=$DATABASE
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD
HOST=$HOST
DB_DIALECT=$DB_DIALECT
END
)

# Write environment variables to .env file
echo "$env_values" > .env

# Change ownership of the .env file to csye6225
sudo chown csye6225:csye6225 .env

# Print a message indicating the .env file creation
echo ".env file created"
cat .env

# Install npm packages for the application
npm install
npm i

# Print a message indicating successful npm installation
echo "NPM packages installed successfully."


EOF
