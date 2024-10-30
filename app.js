import express from 'express';
import healthzRoute from './routes/healthz-route.js';
import userRoute from './routes/user-route.js';
import imageRoute from './routes/image-route.js';
import logger from './services/logger.js';


const app = express();
app.use(express.json());

app.use('/healthz', healthzRoute);
app.use('/v1/user', userRoute);
app.use('/v1/user/self/pic', imageRoute);

app.all('*',(req, res) =>{
    logger.warn("API end point not allowed ", req.method);
    res.status(404).send();
});
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

