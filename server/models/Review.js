import { pool } from '../helpers/db.js';

// Needed operations: Create a review, Delete a review, Get reviews
const createReview = async(email, reviewText, stars, movieName) => {
    try {
        const result = await pool.query('insert into review (email, review_text, stars, movie_name, date) values ($1,$2,$3,$4,localtimestamp) returning *',[email,reviewText,stars,movieName]);
        return result;
    } catch (error) {
        console.error('Error creating review:', error);
        throw new Error('Database error');
    }
}

export { createReview };