import { Router } from 'express';
import { removeShowingFromGroup, showtimeGetFromGroupTable, showtimeSendToGroupTable } from "../controllers/ShowtimeController.js";

const router = new Router()

router.post('/send', showtimeSendToGroupTable)

router.get('/get', showtimeGetFromGroupTable)

router.delete('/remove', removeShowingFromGroup)

export default router