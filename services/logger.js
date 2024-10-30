import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  override: true,
  path: path.join(__dirname, '../.env')
});

console.log(process.env.NODE_ENV);
const logPath = process.env.NODE_ENV === 'PROD' ? '/var/log/webapp/app.log' : path.join(__dirname, 'app.log');

const logFormat = winston.format.printf(({ level, message, timestamp, httpRequest}) => {
    return JSON.stringify({
      timestamp: timestamp,
      severity: level.toUpperCase(),
      message,
      httpRequest
    })
  });

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.File({ filename: logPath }),
    new winston.transports.Console(),
  ],
});

export default logger;