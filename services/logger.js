import winston from 'winston';

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
    new winston.transports.File({ filename: '/Users/ayashakhan/Desktop/Courses/Cloud/src/khanayas/app.log' }),
    new winston.transports.Console(),
  ],
});

export default logger;