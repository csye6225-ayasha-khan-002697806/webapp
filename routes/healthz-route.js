import express from 'express';
import {checkServerHealth} from '../controller/healthz-controller.js';

const route = express.Router();

route.all('/', checkServerHealth);

export default route;