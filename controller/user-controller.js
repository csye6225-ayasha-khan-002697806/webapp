import * as userService from '../services/user-service.js';
import { connectingDB } from '../config/database.js';
import logger from '../services/logger.js';
import { statsdClient } from '../services/statD.js';
import jwt from 'jsonwebtoken';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
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


// // SNS client initialization
// const sns = new AWS.SNS({ region: process.env.AWS_REGION });

// Example of using the SNS client
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

const getUser = async (req, res) => {
  statsdClient.increment('api.get_user.count');
  const startGet = Date.now();
    try {
        await connectingDB();
    
        res.header('cache-control', 'no-cache');

        const email = req.username;
        console.log(`inside getUser controller endpoint ${email}`);
        logger.info(`inside getUser controller endpoint ${email}`);
        if (req.headers['content-type'] || Object.keys(req.query).length > 0) {
            logger.error({
                message: "Payload not allowed", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
              })
            return res.status(400).send();
        }
        else{
            const user = await userService.findUserForGet(email)
            if(user){
                if(user.verified === false){
                  logger.info({
                    message: "User is not verified", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 403, 
                    }
                  })
                  return res.status(403).json({ message: "User not verified. Please verify your account." });
                }
                logger.info({
                    message: "User data fetched successfully", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 200, 
                    }
                  })
                res.status(200).json(user)
            }
            else{
                logger.warn({
                    message: "User not found", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 400, 
                    }
                  })
                res.status(400).json({message: "User not found"})
            }
        } 
    } catch (error) {
        console.error(error);
        logger.error({
            message: `Error while fetching user data ${error}`, 
            httpRequest: {
              requestMethod: req.method,
              requestUrl: req.originalUrl,
              status: 503, 
            }
        })
        return res.status(503).end();
    }finally {
      // Calculate duration and send to StatsD
      const duration = Date.now() - startGet;
      statsdClient.timing('api.get_user_api_timimg.duration', duration);
  }

}

const updateUser = async (req, res) => {

    statsdClient.increment('api.update_user.count');
    const startPut = Date.now();
    try{
        await connectingDB();
        const email = req.username;
        res.header('cache-control', 'no-cache');

        if(email !== req.body.email){
            logger.warn({
                message: "Email in payload and Authentication do not match.", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
              })
            return res.status(400).json();
        }

        const requiredFields = ['first_name', 'last_name', 'email', 'password'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                logger.warn({
                    message: `${field} is required`, 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 400, 
                    }
                  }) 
                return res.status(400).json({ message: `${field} is required` });
            }
        }
    
        if (req.body.hasOwnProperty('uuid') || req.body.hasOwnProperty('account_created') || req.body.hasOwnProperty('account_updated') || 
        req.body.first_name === '' || req.body.last_name === '' || 
        req.body.email === '' || req.body.password === '' || 
        req.body.first_name === null || req.body.last_name === null || 
        req.body.email === null || req.body.password === null) {
            logger.warn({
                message: "Invalid payload fields or values", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
              }) 
            return res.status(400).json();
        }
        else{
            try {
                const user = await userService.searchUserToUpdate(email)
                console.log(user.verified);
                if(user.verified === false){
                  logger.info({
                    message: "User is not verified", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 403, 
                    }
                  })
                  return res.status(403).json({ message: "User not verified. Please verify your account." });
                }

                user.set({...user.dataValues, ...req.body})
        
                await user.save();
                logger.info({
                    message: "User data updated successfully", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 204, 
                    }
                  })
                return res.status(204).json();
                
            } catch (error) {
                console.error('Error updating user:', error);
                logger.error({
                    message: `Error while updating user data ${error}`, 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 500, 
                    }
                })
                return res.status(500).json();
            }
        }
    }catch(error){
        console.error(error);
        logger.error({
            message: `Error while updating user data ${error}`, 
            httpRequest: {
              requestMethod: req.method,
              requestUrl: req.originalUrl,
              status: 503, 
            }
        })
        return res.status(503).end();
    }finally {
      // Calculate duration and send to StatsD
      const duration = Date.now() - startPut;
      statsdClient.timing('api.update_user_api_timimg.duration', duration);
  }
}


const createUser = async (req, res) => {

    statsdClient.increment('api.create_user_api.count');
    const startPost = Date.now();
    try{
        await connectingDB();
        res.header('cache-control', 'no-cache');
    
        // const email = req.body.email
        const { email, first_name, last_name, password } = req.body;

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            logger.error({
                message: "Invalid Email format", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
              })
            return res.status(400).json()
        }
        else{
            if (req.body.hasOwnProperty('uuid') || req.body.hasOwnProperty('account_created') || req.body.hasOwnProperty('account_updated') || 
            !req.body.hasOwnProperty('first_name') || !req.body.hasOwnProperty('last_name') ||
            !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password') ||
            req.body.first_name === '' || req.body.last_name === '' || 
            req.body.email === '' || req.body.password === '' || 
            req.body.first_name === null || req.body.last_name === null || 
            req.body.email === null || req.body.password === null) { 
                
                logger.warn({
                    message: "Invalid payload fields or values", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 400, 
                    }
                  })  
                return res.status(400).json();
            }
            else{  
                const userExists = await userService.emailIdAlreadyRegistered(email)
        
                if(userExists){
                    logger.warn({
                        message: "Email is already Registered!", 
                        httpRequest: {
                          requestMethod: req.method,
                          requestUrl: req.originalUrl,
                          status: 400, 
                        }
                      })
                    res.status(400).send({
                        message: "Email is already Registered!"
                    })
                }
                else{
                    try{

                        // Generate JWT token and expiry
                        const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '2m' });
                        const tokenExpiry = new Date(Date.now() + 2 * 60 * 1000);

                        
                        // const user = await userService.addUser(req.body);
                        // Create user and save the token
                        const user = await userService.addUser({
                          first_name,
                          last_name,
                          email,
                          password,
                          verificationToken: token,
                          tokenExpiry,
                          verified: false
                        });
                        
                        // Publish to SNS
                        const message = JSON.stringify({
                          email: user.email,
                          first_name: user.first_name,
                          last_name: user.last_name,
                          token
                        });

                        const params = { TopicArn: process.env.SNS_TOPIC_ARN, Message: message };

                        // Create PublishCommand and send it with snsClient.send()
                        const publishCommand = new PublishCommand(params);
                        await snsClient.send(publishCommand);  // This is the corrected usage

                        // logger.info('User created successfully and SNS message published.');
                        logger.info({
                            message: "User created successfully", 
                            httpRequest: {
                              requestMethod: req.method,
                              requestUrl: req.originalUrl,
                              status: 201, 
                            }
                          })
                        return res.status(201).send(user)
                    } 
                    catch(err){
                        logger.error({
                            message: `Error while creating user ${err}`, 
                            httpRequest: {
                              requestMethod: req.method,
                              requestUrl: req.originalUrl,
                              status: 400, 
                            }
                          })
                        return res.status(400).json();
                    }
                }
            }
        
        }
    }catch(error){
        console.error(error);
        logger.error({
            message: `Error while updating user data ${error}`, 
            httpRequest: {
              requestMethod: req.method,
              requestUrl: req.originalUrl,
              status: 503, 
            }
        })
        return res.status(503).end();
    }finally {
      // Calculate duration and send to StatsD
      const duration = Date.now() - startPost;
      statsdClient.timing('api.create_user_api_timimg.duration', duration);
    }
    
}

const invalidURL = async (req, res) => {
    statsdClient.increment('api.invalid_endpoint.count');
    logger.error({
        message: "Invalid API endpoint", 
        httpRequest: {
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          status: 405, 
        }
    })
    return res.status(405).end();
}

const verifyUser = async (req, res) => {
  const { user, token } = req.query;

  console.log("inside the verify api", user);
  
  try {
    await connectingDB();

    res.header('cache-control', 'no-cache');
    // Find the user by email
    const foundUser = await userService.searchUserToUpdate(user)

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if(foundUser.verified === true){
      return res.status(200).json({ message: "No action performed. The user is already verified." });

    }
    // Check token validity
    if (foundUser.verificationToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    console.log("user token is compared and equal");
    if (new Date() > new Date(foundUser.tokenExpiry)) {
      return res.status(400).json({ message: 'Token has expired.' });
    }

    foundUser.set({
      verified: true,
      verificationToken: null,
      tokenExpiry: null,
    });
    
    await foundUser.save({ fields: ['verified', 'verificationToken', 'tokenExpiry'] });
    
    console.log("user data is set with verified flag")
    // await foundUser.save();
    console.log("user saved to DB with verified flag")
    logger.info('User verified successfully.');
    return res.status(200).json({ message: 'User verified successfully.' });
  } catch (error) {
    logger.error('Error during user verification:', error);
    return res.status(503).end();
  }
};

export {getUser, updateUser, createUser, invalidURL, verifyUser};
