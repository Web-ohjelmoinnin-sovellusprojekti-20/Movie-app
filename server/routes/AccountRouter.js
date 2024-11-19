import { Router } from 'express';
import { deleteAccount, postAccountLogin, postAccountRegistration } from '../controllers/AccountController.js';
import { auth } from '../helpers/auth.js';

const router = Router();

router.post('/create', postAccountRegistration);

router.post('/login', postAccountLogin);

router.delete('/delete',auth, deleteAccount);