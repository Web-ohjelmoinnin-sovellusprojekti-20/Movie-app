import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

// Make a create test database function
const initializeTestDatabase = () => {
    const sql = fs.readFileSync(path.resolve('db.sql'), 'utf8');
    pool.query(sql);
};
// Make a insert test account function
const insertTestAccount = (email, password) => {
    hash(password, 10, (error, hashedPassword) => {
        pool.query('insert into account (email, password) values ($1,$2) returning *' [email,hashedPassword]);
    });
};
// Make a function for retrieving the jsonwebtoken
const getToken = (email) => {
    return jwt.sign({account: email}, process.env.JWT_SECRET_KEY);
};

export { initializeTestDatabase, insertTestAccount, getToken };