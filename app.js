import express from 'express';
import healthzRoute from './routes/healthz-route.js';
import userRoute from './routes/user-route.js';


const app = express();
app.use(express.json());

app.use('/healthz', healthzRoute);
app.use('/v1/user', userRoute);
app.all('*',(req, res) =>{
    res.status(404).send();
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

