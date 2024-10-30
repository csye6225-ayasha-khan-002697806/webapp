import * as userService from '../services/user-service.js';
import { connectingDB } from '../config/database.js';
import logger from '../services/logger.js';

const getUser = async (req, res) => {
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
    }

}

const updateUser = async (req, res) => {

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
    }
}


const createUser = async (req, res) => {

    try{
        await connectingDB();
        res.header('cache-control', 'no-cache');
    
        const email = req.body.email
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
                        const user = await userService.addUser(req.body);
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
    }
}

const invalidURL = async (req, res) => {
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

export {getUser, updateUser, createUser, invalidURL};
