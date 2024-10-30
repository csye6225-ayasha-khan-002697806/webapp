import User from "../model/user.js";
import bcrypt from 'bcrypt';
import logger from '../services/logger.js'

const checkAuthenticatedUser = async (req, res, next) => {
  if (!req.get('Authorization')) {
    const err = new Error('Not Authenticated!');
    logger.warn({
      message: "User not authenticated", 
      httpRequest: {
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        status: 401, 
      }
    })
    res.status(401).set('WWW-Authenticate', 'Basic');
    return next(err);
  }

  try {
    // base64 encoded - email:password
    const authHeader = req.get('Authorization');
    const encodedCredentials = authHeader.split(' ')[1]; // Extract base64 encoded part
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString().split(':');
  
    console.log(`basic token: ${encodedCredentials}`);
    logger.info(`basic token: ${encodedCredentials}`);
    const email = decodedCredentials[0];  // Email is used as the username
    const password = decodedCredentials[1];

    console.log(`email in Auth`);
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      logger.warn({
        message: "Authentication failed! Wrong username or password!", 
        httpRequest: {
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          status: 401, 
        }
      })
      return res.status(401).send({
        message: "Authentication failed! Wrong Username or password!",
      });
    }

    const dbPassword = user.dataValues.password;
    const isPasswordValid = await bcrypt.compare(password, dbPassword);

    if (isPasswordValid) {
      console.log("Authentication successful");
      logger.info({
        message: "Authenticated successfully", 
        httpRequest: {
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          status: 200, 
        }
      })
      req.username = email; // Store email in the request object for further use
      next(); 
    } else {
      console.log("Authentication failed");
      logger.warn({
        message: "Authentication failed! Wrong username or password!", 
        httpRequest: {
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          status: 401, 
        }
      })
      return res.status(401).send({
        message: "Authentication failed! Wrong username or password!",
      });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    logger.error("Error during authentication:", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

export default checkAuthenticatedUser;
