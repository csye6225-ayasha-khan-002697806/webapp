import express from 'express';
import * as userController from '../controller/user-controller.js';
import checkAuthenticatedUser from '../middleware/user-auth-service.js'

const route = express.Router();

// New route for user verification
route.head("/verify", userController.invalidURL);
route.get("/verify", userController.verifyUser); 

route.head("/", userController.invalidURL);
route.head("/self", userController.invalidURL);

route.get("/self", checkAuthenticatedUser, userController.getUser);
route.put("/self", checkAuthenticatedUser, userController.updateUser);
route.post("/", userController.createUser);

// // New route for user verification
// route.get("/verify", userController.verifyUser);  // Add this line for the verifyUser route

route.all("/verify", userController.invalidURL);
route.all("/self", userController.invalidURL);

// route.all("/self/*", userController.invalidURL);



export default route;