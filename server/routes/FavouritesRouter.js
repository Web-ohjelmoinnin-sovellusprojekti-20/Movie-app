import { Router } from 'express';
import { appendList, getFavourites, removeFromList } from '../controllers/FavouriteController.js';


const router = new Router()

//get favourite lists
router.get('/favourites', getFavourites)

//add to list (array_append)
router.post('/append', appendList)

//remove a movie from list
router.delete('/remove', removeFromList)

//initialize email in favorites table
//routes.post('/initialize', initializeEmail)

export default router