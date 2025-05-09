// services/ImageService.js
import Image from '../model/image.js';
import { s3Upload, s3Delete } from './s3actions-service.js';
import { statsdClient } from '../services/statD.js'

export const addImage = async (user, file) => {
    // Step 1: Check if the user exists

    if (!user) {
        throw new Error('User not found');
    }

    console.log(file); // Check the structure of the file object

    const userId = user.id;
    // Step 2: Validate the file format
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedFormats.includes(file.mimetype)) {
        throw new Error('Unsupported image format. Allowed formats are png, jpg, jpeg.');
    }

    /// Step 3: Upload to S3
    const fileName = `${userId}/${file.originalname}`; 
    const url = await s3Upload(fileName, file); // Correct order


    console.log("file upload done");
    // Step 4: Save image metadata in the database
    const startCreateImage = Date.now();
    const image = await Image.create({
        fileName: file.originalname,
        url,
        userId,
        uploadDate: new Date(),
    });

    const duration = Date.now() - startCreateImage;
    statsdClient.timing('db.query.create_image_data_query.duration', duration);
    return image;
};


//get image
export const getImageById = async (user) => {
    // Fetch the image associated with the given user ID

    if (!user) {
        throw new Error('User not found');
    }

    const userId = user.id;

    const startGetImage = Date.now();
    const image = await Image.findOne({ where: { userId } });

    const duration = Date.now() - startGetImage;
    statsdClient.timing('db.query.get_image_query.duration', duration);

    return image;
};


export const deleteImageByUserId = async (user) => {
    // Fetch the image associated with the given user ID

    if (!user) {
        throw new Error('User not found');
    }

    const userId = user.id;

    const startDeleteImage = Date.now();
    const image = await Image.findOne({ where: { userId } });
    if (!image) {
        throw new Error('Image not found');
    }


    // Delete the image from S3
    console.log("file name in DB ", image.fileName)
    const fileToBeDeleted = `${userId}/${image.fileName}`; 

    console.log("abosolute file name ", fileToBeDeleted);
    await s3Delete(fileToBeDeleted);
    
    // Delete the image from the database
    await image.destroy();

    const duration = Date.now() - startDeleteImage;
    statsdClient.timing('db.query.delete_image_query.duration', duration);
    return image; // Optional: Return the deleted image or any confirmation info
};