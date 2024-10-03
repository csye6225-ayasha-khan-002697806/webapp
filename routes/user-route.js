import express from 'express';
import * as userController from '../controller/user-controller.js';
import checkAuthenticatedUser from '../middleware/user-auth-service.js'

const route = express.Router();

route.head("/", userController.invalidURL);
route.head("/self", userController.invalidURL);

route.get("/self", checkAuthenticatedUser, userController.getUser);
route.put("/self", checkAuthenticatedUser, userController.updateUser);
route.post("/", userController.createUser);
route.all("*", userController.invalidURL);

route.all("/self/*", userController.invalidURL);



export default route;