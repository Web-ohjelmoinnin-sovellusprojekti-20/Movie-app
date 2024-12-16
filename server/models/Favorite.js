import { pool } from '../helpers/db.js';

const getVisibleFavorites = async() => {
    try {
        const query = `
            SELECT email, UNNEST(movie_name) AS movie_name
            FROM favorite
            WHERE current_visibility = 'VISIBLE'
        `;
        return await pool.query(query);
    } catch (error) {
        console.error('Error getting visible favorites:', error);
        throw new Error('Database error');
    }
};

const appendToFavorite = async(email,movie_name) => {
    try {
        const query = `
            UPDATE favorite
            SET movie_name = array_append(movie_name, $1),
            current_visibility = 'VISIBLE'
            WHERE email = $2
        `;
        return await pool.query(query,[movie_name, email]);
    } catch (error) {
        console.error('Error updating favorite list:', error);
        throw new Error('Database error');
    }
};

const deleteFromFavorite = async(email, movie_name) => {
    try {
        const query = `
            UPDATE favorite
            SET movie_name = array_remove(movie_name, $1)
            WHERE email = $2
        `;
        return await pool.query(query,[movie_name, email]);
    } catch (error) {
        console.error('Error updating favorite list:', error);
        throw new Error('Database error');
    }
};

export { appendToFavorite, deleteFromFavorite, getVisibleFavorites };

