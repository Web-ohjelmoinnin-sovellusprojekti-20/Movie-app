import { ApiError } from '../helpers/ApiError.js';
import { createReview, deleteReview } from '../models/Review.js';


const postAddReview = async(request, response, next) => {
    try {
        if (!request.body) return next(new ApiError('Invalid request',400));
        const { email, review_text, stars, movie_name } = request.body;
        if (!email || !review_text || !stars || !movie_name) return next(new ApiError('Missing field data',400));

        const reviewFromDb = await createReview(email, review_text, stars, movie_name);
        const review = await reviewFromDb.rows[0];
        const reviewId = await review.review_id;
        return response.status(201).json({review_id: reviewId});
    } catch (error) {
        return next(error);
    }
};

const deleteRemoveReview = async(request, response, next) => {
    try {
        console.log('Review ID to delete:', request.params.id);
        if (!request.params.id) return next(new ApiError('Missing review ID', 400));
        const reviewId = request.params.id;
        const result = await deleteReview(reviewId);
        console.log('Delete result:', result);
        if (result.rowCount === 0) return next(new ApiError('Review not found', 404));
        return response.status(200).json({ review_id: reviewId });
    } catch (error) {
        console.error('Error in deleteRemoveReview:', error.message);
        return next(new ApiError('Internal server error', 500));
    }
};


export { postAddReview, deleteRemoveReview };