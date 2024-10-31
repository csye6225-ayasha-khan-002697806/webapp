import * as imageService from '../services/image-service.js';
import { connectingDB } from '../config/database.js';
import logger from '../services/logger.js';
import { s3Upload, s3Delete } from '../services/s3actions-service.js'; // create an S3 service for upload/delete
import * as userService from '../services/user-service.js';
import { statsdClient } from '../services/statD.js'

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


const getImageById  = async(req, res) => {
    console.log("hit the image controller to get");
    return res.status(200).end();
}


const addImage  = async(req, res) => {
    console.log("hit the image controller to add");
    return res.status(200).end();
}

const deleteImage = async(req, res) => {
    console.log("hit the image controller to delete");
    return res.status(200).end();
}



const addImageHandler = async (req, res) => {

    if ( Object.keys(req.query).length > 0) {
        logger.error({
            message: "Payload not allowed", 
            httpRequest: {
                requestMethod: req.method,
                requestUrl: req.originalUrl,
                status: 400, 
            }
        });
        return res.status(400).send({ error: "Payload or query parameters not allowed" });
    }

    statsdClient.increment('api.add_image_api_count.count');
    const startAddImage = Date.now();
    try {

        res.header('cache-control', 'no-cache');

        if (!req.file) {
            logger.error({
                message: `File not uploaded`, 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
            })
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Check if extra form fields are sent beyond the file
        if (Object.keys(req.body).length > 0) {
            logger.error({
                message: `Any field apart from file is not allowed`, 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
            })
            return res.status(400).json({ error: 'Unexpected form data received' });
        }

        await connectingDB();
        const email = req.username;

        if (!email) {
            logger.error({
                message: `Email not find`, 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
            })
            return res.status(400).json({ error: 'User email is missing in request' });
        }


        const user = await userService.searchUserToUpdate(email);

        if (!user) {
            logger.error({
                message: `User not found`, 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
            })
            return res.status(404).json({ error: 'User not found' });
        }

        const existingImage = await imageService.getImageById(user);
        if (existingImage) {
            logger.error({
                message: "User already has an image uploaded",
                httpRequest: {
                    requestMethod: req.method,
                    requestUrl: req.originalUrl,
                    status: 409, 
                }
            });
            return res.status(409).json({ error: "User already has an image uploaded" });
        }

        const image = await imageService.addImage(user, req.file);
        res.status(201).json(image);
    } catch (error) {
        if (error.message === 'User not found') {
            logger.error({
                message: `User not found ${error}`, 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 404, 
                }
            })
            res.status(404).json({ error: error.message });
        } else {
            logger.error({
                message: `There is some issue while uploading Image ${error}`, 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
            })
            res.status(400).json({ error: error.message });
        }
    }finally {
        // Calculate duration and send to StatsD
        const duration = Date.now() - startAddImage;
        statsdClient.timing('api.add_image_api_timimg.duration', duration);
    }
};


const getProfilePic = async (req, res) => {

    statsdClient.increment('api.get_image_api_count.count');
    const startGetImage = Date.now();
    const email = req.username;

    try {
        // Call the service to get the image
        await connectingDB();
        const user = await userService.searchUserToUpdate(email);

        const image = await imageService.getImageById(user);
        console.log("image get by service", image);
        if(image === null){
            logger.error({
                message: `Image not found for this user`, 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 404, 
                }
            })
            return res.status(404).json({ error: 'Image not found for this user' });
        }
        // Prepare the response
        const response = {
            file_name: image.fileName,
            id: image.id,
            url: image.url,
            upload_date: image.uploadDate,
            user_id: image.userId,
        };

        return res.status(200).json(response);
    } catch (error) {
        logger.error("Error retrieving image", error);
        // Check if the error is specifically about image not found
        if (error.message === 'Image not found') {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }finally {
        // Calculate duration and send to StatsD
        const duration = Date.now() - startGetImage;
        statsdClient.timing('api.get_image_api_timimg.duration', duration);
    }
};


const deleteProfilePic = async (req, res) => {

    statsdClient.increment('api.delete_image_api_count.count');
    const startDeleteImage = Date.now();
    const email = req.username;

    try {
        // Call the service to delete the image
        await connectingDB();
        const user = await userService.searchUserToUpdate(email);

        await imageService.deleteImageByUserId(user);
        
        // Return 204 No Content
        return res.status(204).send();
    } catch (error) {
        logger.error("Error deleting image", error);
        // Check if the error is specifically about image not found
        if (error.message === 'Image not found') {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }finally {
        // Calculate duration and send to StatsD
        const duration = Date.now() - startDeleteImage;
        statsdClient.timing('api.delete_image_api_timimg.duration', duration);
    }
};


export { invalidURL, getProfilePic, addImageHandler, deleteProfilePic};