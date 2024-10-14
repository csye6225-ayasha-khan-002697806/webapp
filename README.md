# Webapp

Assignment 01: Health Check REST API

## Setting up Node.js project

1. mkdir Ayasha_Khan_002697806_01
2. cd Ayasha_Khan_002697806_01
3. Initialize a new package.json file: 
   1. npm init -y
4. Install Dependencies - including Sequelize, PostgreSQL, and Express: 
   1. npm install express sequelize pg pg-hstore
5. Install Required Packages for env
   1. npm install dotenv
6. to run the project
   1. npm run
7. To start the application
   1. npm start


Assignment 02 : User create and update

1. npm install basic-auth bcryptjs chai supertest
2. npm install --save-dev jest mocha


## Technologies used

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm (Node Package Manager): Included with Node.js installation
  
## Installation

1. Clone the repository:

    ```
    git clone git@github.com:KhanAyasha/khanayas.git
    ```

2. Navigate to the project directory:

    ```
    cd khanayas
    ```

3. Install dependencies:

    ```
    npm install
    ```

4. Set up the database:

    - Create a postgres database.
    - Update the database configuration in .env file with your database credentials.


5. Set environment variables:

    Create a .env file in the root directory and add the following:

    ```env
    DATABASE=csye6225_ayasha_khan_002697806              
    DB_USERNAME=      # PostgreSQL database username
    DB_PASSWORD=      # PostgreSQL database password
    HOST=             # Database host, often 'localhost' during development
    PORT=             # PostgreSQL default port is 5432
    DB_DIALECT=postgres
    ```
    

## Usage

To run the application locally, use the following command:

```
npm run 
```

To start the application locally, use the following command:

```
npm start 
```
## Reference 
1. https://www.youtube.com/watch?v=btWo1jxFwp8
2. https://sequelize.org/docs/v6/other-topics/legacy/
3. https://www.youtube.com/watch?v=bOHysWYMZM0&list=PLbZ6yn8dyClCUGeqqoYZgSbhioFsg8w_f&index=1

## steps to deploy and run your web app in VM on digital ocean

1. Scp env and project file

scp -i ./.ssh/digitalocean /Users/ayashakhan/Documents/env.txt root@161.35.98.43:/root/assignment02
scp -i ./.ssh/digitalocean /Users/ayashakhan/Documents/Ayasha_Khan_002697806_02.zip root@161.35.98.43:/root/assignment02


2. On remote server install unzip if not present
sudo apt update
sudo apt install unzip

3. Unzip the file in remote server
unzip Ayasha_Khan_002697806_02.zip 

* apt install -y nodejs
* Apt install npm

4. Check node version
node -v
npm -v

5. Got to your working folder
Cd /root/assignment02/Ayasha_Khan_002697806_02/webapp

6. Install postgres
sudo apt install postgresql postgresql-contrib


7. Connect to Postgres, create user and database

sudo -i -u postgres
psql
CREATE USER myapp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE csye6225_ayasha_khan_002697806 TO myapp_user;
 ALTER DATABASE csye6225_ayasha_khan_002697806 OWNER TO ayashakhan;


8. Copy paste your .env  in working directory


9. Now initiating node project
    1. npm install
    2. npm install express sequelize pg pg-hstore
    3. npm install dotenv
    4. npm install basic-auth bcryptjs chai supertest
    5. npm install --save-dev jest mocha
    6. npm install bcrypt
    

    7.  To connect to database and see tables
* \c csye6225_ayasha_khan_002697806; — to switch to user 
* \d— relations in this user


## Author

Ayasha Khan
