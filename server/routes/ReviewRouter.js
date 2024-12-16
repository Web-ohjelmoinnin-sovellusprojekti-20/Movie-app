import { Router } from 'express';
import { deleteRemoveReview, fetchGetReviews, postAddReview } from '../controllers/ReviewController.js';
import { auth } from '../helpers/auth.js';

const router = new Router();

router.get('/all', fetchGetReviews); // fetch reviews by movie id or user id, depends on the requirements.

router.post('/create', auth, postAddReview);

router.delete('/delete/:id', auth, deleteRemoveReview);

export default router;