import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory if needed
dotenv.config({
  override: true,
  path: path.join(__dirname, '../.env')
});

const db = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
});


const connectingDB = async() => {
    try{
        await db.authenticate();
        console.log('Database CONNECTED...');

        await db.sync();
        console.log('Database SYNCHRONIZATION SUCCESS...');
    }catch(error){
        console.log('Database NOT CONNECTED: ', error);
        throw error; 
    }
};



export {  connectingDB };