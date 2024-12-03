import { Router } from 'express';
import { postAddReview } from '../controllers/ReviewController.js';
import { auth } from '../helpers/auth.js';

const router = new Router();

router.post('/create', auth, postAddReview);

export default router;