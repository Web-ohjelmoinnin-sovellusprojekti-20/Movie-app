import { ApiError } from '../helpers/ApiError.js';
import { createReview } from '../models/Review.js';


const postAddReview = async(request, response, next) => {
    try {
        if (!request.body) return next(new ApiError('Invalid request',400));
        const { email, review_text, stars, movie_name } = request.body;
        if (!email || !review_text || !stars || !movie_name) return next(new ApiError('Missing field data',400));

        const reviewFromDb = await createReview(email, review_text, stars, movie_name);
        const review = await reviewFromDb.rows[0];
        const reviewId = await review.review_id;
        return response.status(201).json({id: reviewId});
    } catch (error) {
        return next(error);
    }
};

export { postAddReview };