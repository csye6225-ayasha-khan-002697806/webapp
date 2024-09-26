import express from 'express';
import healthzRoute from './routes/healthz-route.js';


const app = express();
app.use('/healthz', healthzRoute);

  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

