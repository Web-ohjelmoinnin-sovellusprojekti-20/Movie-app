import { Router } from 'express';
import { fetchAllGroups, createGroup, deleteGroup, joinGroup, removeMember, leaveGroup, fetchAllMembers, fetchUserGroups } from '../controllers/GroupController.js';

const router = new Router();

//fetch groups
router.get('/all', fetchAllGroups);

//fetch owned groups
router.get('/user/:user_email', fetchUserGroups);

//create group
router.post('/create', createGroup);

//delete group
router.delete('/:groupId', deleteGroup);

//join group
router.post('/:groupId/join', joinGroup);

//remove member
router.delete('/:groupId/members/:member_email', removeMember);

//leave group
router.delete('/:groupId/members/:member_email', leaveGroup);

//fetch group members
router.get('/:groupId/members', fetchAllMembers);

export default router;