import cors from 'cors';
import express from 'express';
import accountRouter from './routes/AccountRouter.js';
import favouritesRouter from './routes/FavouritesRouter.js';
import groupRouter from './routes/GroupRouter.js';
import reviewRouter from './routes/ReviewRouter.js';
import showtimeRouter from './routes/ShowtimeRouter.js';

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/account',accountRouter);

app.use('/review',reviewRouter);

//groups
app.use('/groups', groupRouter);
app.use((error,request,response,next) => {
    const statusCode = error.statusCode || 500;
    response.status(statusCode).json({error: error.message});
});

//favourites
app.use('/favourites', favouritesRouter)

//showtimes
app.use('/showtimes', showtimeRouter)

app.listen(port);