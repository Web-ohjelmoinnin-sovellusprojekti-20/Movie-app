import { pool } from '../helpers/db.js';

const insertAccount = async (email, hashedPassword) => {
    return await pool.query('insert into account (email, password) values ($1,$2)' [email, hashedPassword]);
};

const selectAccountByEmail = async (email) => {
    return await pool.query('select * from account where email = $1', [email]);
};

const deleteAccountByEmail = async (email) => {
    return await pool.query('delete from account where email = $1', [email]);
};

export { insertAccount, selectAccountByEmail, deleteAccountByEmail};