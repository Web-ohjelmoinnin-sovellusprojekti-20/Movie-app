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

const getReviews = async() => {
    try {
        const result = await pool.query('select * from review order by date desc');
        return result;
    } catch (error) {
        console.error('Error getting reviews:', error);
        throw new Error('Database error');
    }
};

const deleteReview = async(reviewId) => {
    try {
        const result = await pool.query('delete from review where review_id = ($1) returning review_id', [reviewId]);
        return result;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw new Error('Database error');
    }
};

export { createReview, deleteReview, getReviews };