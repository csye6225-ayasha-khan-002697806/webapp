import express from 'express';
import * as imageController from '../controller/image-controller.js';
import checkAuthenticatedUser from '../middleware/user-auth-service.js';
import uploadMiddleware from '../middleware/s3-middleware.js';


const route = express.Router();

route.head("/", imageController.invalidURL);

route.post(
    '/',
    checkAuthenticatedUser,               // First middleware
    uploadMiddleware.single('file'), // Second middleware to handle file uploads
    imageController.addImageHandler            // Route handler
);

route.get("/", checkAuthenticatedUser, imageController.getProfilePic );
route.delete("/", checkAuthenticatedUser, imageController.deleteProfilePic);
// route.post("/", checkAuthenticatedUser, imageController.addImage);
route.all("*", imageController.invalidURL);
route.all("/*", imageController.invalidURL);



export default route;