import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/user.routes.js';

import { connectdb } from './db/connectdb.js';
import router2 from './routes/map.route.js';
import router3 from './routes/complaint.route.js';
import router4 from './routes/officer.route.js';
import router5 from './routes/worker.route.js';
import router7 from './routes/task.route.js';

const app = express();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb",extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', `${process.env.frontend}`],
    credentials: true
}));


app.use('/user', router);
app.use('/map',router2);
app.use('/complaint',router3);
app.use('/officer',router4);
app.use('/worker',router5);
app.use('/task',router7);

export default app;

