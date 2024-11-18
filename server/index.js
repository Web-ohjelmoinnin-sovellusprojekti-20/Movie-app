import express, { response } from 'express';
import cors from 'cors';
import { pool } from './helpers/db.js';

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.json({message: 'Hello from Express!'});
});

app.get('/getuserexample', (request, response) => {
    pool.query('select email from account', (error,result) => {
        if(error) {
            response.status(500).json({error: error.message});
        } else {
            response.status(200).json(result.rows);
        }
    });
});

app.post('/signupexample', (request, response) => {
    pool.query('insert into account (email, password) values ($1,$2) returning email',
        [request.body.email, request.body.password], 
        (error, result) => {
            if(error) {
                response.status(500).json({error: error.message});
            } else {
                response.status(200).json({email: result.rows[0].email});
            }
    });
});

app.delete('/deleteaccountexample/:email', (request, response) => {
    const email = request.params.email;
    console.log(email);
    pool.query('delete from account where email = $1', [email],
        (error, result) => {
            if(error) {
                response.status(500).json({error: error.message});
            } else {
                response.status(200).json({message: 'Account deleted successfully'});
            }
        }
    );
});
app.use((error,request,response,next) => {
    const statusCode = err.statusCode || 500;
    response.status(statusCode).json({error: error.message});
});

app.listen(port);