import { Router } from 'express'
import { getFavourites } from '../controllers/FavouriteController.js'

const router = new Router()

//get favourite lists
router.get('/favourites', getFavourites)

//add to list
//router.post('/append', favouriteAppend)

export default router