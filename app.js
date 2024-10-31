import express from 'express';
import healthzRoute from './routes/healthz-route.js';
import userRoute from './routes/user-route.js';
import imageRoute from './routes/image-route.js';
import logger from './services/logger.js';
import {db} from './config/database.js' 
import User from './model/user.js';
import Image from './model/image.js'


const app = express();
app.use(express.json());

app.use('/healthz', healthzRoute);
app.use('/v1/user', userRoute);
app.use('/v1/user/self/pic', imageRoute);

app.all('*',(req, res) =>{
    logger.warn("API end point not allowed ", req.method);
    res.status(404).send();
});
  
// Synchronize models after defining the routes
const syncDatabase = async () => {
    try {
        await User.sync(); // Sync User model
        console.log('User table created successfully.');
        logger.info("User table created successfully.");

        await Image.sync(); // Sync Image model
        console.log('Image table created successfully.');
        logger.info("Image table created successfully.");
    } catch (error) {
        console.error('Error creating tables:', error);
        logger.error("Error creating tables:", error);
    }
};

syncDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

