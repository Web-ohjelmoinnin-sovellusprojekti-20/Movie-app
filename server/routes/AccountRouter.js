import { Router } from 'express';
import { deleteAccount, getAccountEmail, postAccountLogin, postAccountRegistration } from '../controllers/AccountController.js';
import { auth } from '../helpers/auth.js';

const router = new Router();

router.get('/account', getAccountEmail);

router.post('/create', postAccountRegistration);

router.post('/login', postAccountLogin);

router.delete('/delete',auth, deleteAccount);

export default router;