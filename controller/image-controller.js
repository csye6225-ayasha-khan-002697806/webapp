import * as imageService from '../services/image-service.js';
import { connectingDB } from '../config/database.js';
import logger from '../services/logger.js';

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


export { invalidURL, getImageById, addImage, deleteImage};