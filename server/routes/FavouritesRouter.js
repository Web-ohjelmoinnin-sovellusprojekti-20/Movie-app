import { Router } from 'express';
import { appendList, getFavourites } from '../controllers/FavouriteController.js';


const router = new Router()

//get favourite lists
router.get('/favourites', getFavourites)

//add to list (array_append)
router.post('append', appendList)

export default router