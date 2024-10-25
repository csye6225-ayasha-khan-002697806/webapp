import * as imageService from '../services/image-service.js';
import { connectingDB } from '../config/database.js';

const invalidURL = async (req, res) => {
    return res.status(405).end();
}


const getImageById  = async(req, res) => {
    console.log("hit the image controller to get");
    return res.status(200).end();
}
export { invalidURL, getImageById};