import express from 'express';
import {checkServerHealth, checkServerCICD} from '../controller/healthz-controller.js';

const route = express.Router();

route.all('/', checkServerHealth);
route.all('/CICD', checkServerCICD);


export default route;