# webapp

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


## Author

Ayasha Khan
