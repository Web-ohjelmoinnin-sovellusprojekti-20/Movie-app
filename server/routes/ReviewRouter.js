import { Router } from 'express';
import { deleteRemoveReview, postAddReview } from '../controllers/ReviewController.js';
import { auth } from '../helpers/auth.js';

const router = new Router();

router.post('/create', auth, postAddReview);

router.delete('/delete/:id', auth, deleteRemoveReview);

export default router;