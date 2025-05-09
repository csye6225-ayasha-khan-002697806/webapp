import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { lookup } from 'dns';
import logger from '../services/logger.js';

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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
});



const connectingDB = async() => {
    try{
        await db.authenticate();
        console.log(`database is running with host :${process.env.DB_HOST} `)
        console.log('Database CONNECTED...');
        logger.info(`database is running with host :${process.env.DB_HOST} `);
        logger.info("Database CONNECTED...");

        await db.sync();
        console.log('Database SYNCHRONIZATION SUCCESS...');
        logger.info("Database SYNCHRONIZATION SUCCESS...");
    }catch(error){
        console.log('Database NOT CONNECTED: ', error);
        logger.error('Database NOT CONNECTED: ', error);
        throw error; 
    }
};



export { db,  connectingDB };