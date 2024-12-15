import { Router } from 'express';
import { fetchAllGroups, createGroup, deleteGroup, joinGroup, removeMember, leaveGroup, fetchAllMembers, fetchUserGroups, sendJoinRequest, acceptJoinRequest, declineJoinRequest, fetchJoinRequests } from '../controllers/GroupController.js';

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
//router.post('/:groupId/join', joinGroup);

//remove member
router.delete('/:groupId/members/:member_email', removeMember);

//leave group
router.delete('/:groupId/members/:member_email', leaveGroup);

//fetch group members
router.get('/:groupId/members', fetchAllMembers);

//join request handling:

//send join request
router.post('/:groupId/join', sendJoinRequest);

//accept join request
router.patch('/:groupId/join/:requestEmail/accept', acceptJoinRequest);

//decline join request
router.patch('/:groupId/join/:requestEmail/decline', declineJoinRequest);

//fetch join requests
router.get('/:groupId/join-requests', fetchJoinRequests);

export default router;