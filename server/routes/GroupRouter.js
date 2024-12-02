import { Router } from 'express';
import { fetchAllGroups, createGroup, deleteGroup, joinGroup, removeMember } from '../controllers/GroupController.js';

const router = new Router();

//fetch groups
router.get('/all', fetchAllGroups);

//create group
router.post('/create', createGroup);

//delete group
router.delete('/:groupId', deleteGroup);

//join group
router.post('/:groupId/join', joinGroup);

//remove member
router.delete('/:groupId/members/:memberId', removeMember);

export default router;