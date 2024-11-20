import express, { response } from 'express';
import cors from 'cors';
import { pool } from './helpers/db.js';
import accountRouter from './routes/AccountRouter.js';

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/account',accountRouter);
app.use((error,request,response,next) => {
    const statusCode = error.statusCode || 500;
    response.status(statusCode).json({error: error.message});
});

app.listen(port);