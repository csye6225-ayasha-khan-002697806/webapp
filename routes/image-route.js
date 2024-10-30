import express from 'express';
import * as imageController from '../controller/image-controller.js';
import checkAuthenticatedUser from '../middleware/user-auth-service.js'

const route = express.Router();

route.head("/", imageController.invalidURL);
// route.head("/", imageController.invalidURL);

route.get("/", imageController.getImageById );
// route.delete("/self/pic", checkAuthenticatedUser);
// route.post("/", imageController.addImage);
route.all("*", imageController.invalidURL);
route.all("/*", imageController.invalidURL);



export default route;