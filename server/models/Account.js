import { pool } from '../helpers/db.js';

const insertAccount = async (email, hashedPassword) => {
    try {
        const result = await pool.query(
            'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashedPassword]
        );
        return result;
    } catch (error) {
        console.error('Error inserting account:', error);
        throw new Error('Database error');
    }
};

const selectAccountByEmail = async (email) => {
    return await pool.query('select * from account where email = $1', [email]);
};

const deleteAccountByEmail = async (email) => {
    return await pool.query('delete from account where email = $1', [email]);
};

const initializeFavorites = async (email) => {
    return await pool.query("insert into favorite (email, current_visibility) values ($1, 'HIDDEN')", [email]);
};

export { deleteAccountByEmail, insertAccount, selectAccountByEmail, initializeFavorites };
