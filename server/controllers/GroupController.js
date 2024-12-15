import { ApiError } from '../helpers/ApiError.js';
import pkg from 'jsonwebtoken';
import { pool } from '../helpers/db.js';
import { request, response } from 'express';

const { sign } = pkg;

//fetch groups
const fetchAllGroups = async (req, res) => {
    try {
        const query = 'SELECT id, owner_email, group_name FROM my_groups';
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (err) {
    console.error('Error fetching groups:', err.message);
    res.status(500).json({ error: 'Failed to fetch groups' });
    }
};

//fetch owned groups for account page
const fetchUserGroups = async (req, res) => {
    const { user_email } = req.params;
    console.log('Fetching groups for:', req.params);
    try {
        const query = `SELECT g.id, g.owner_email, g.group_name FROM my_groups g LEFT JOIN group_members gm ON g.id = gm.group_id WHERE g.owner_email = $1 OR gm.member_email = $1`;
        const result = await pool.query(query, [user_email]);
        console.log('Groups fetched:', result.rows);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching owned groups:', err.message);
        res.status(500).json({ error: 'Failed to fetch user groups' });
    }
};

//create group
const createGroup = async (req, res) => {
    const { owner_email, group_name } = req.body;
    console.log('Received request to create group with:', req.body);

    if (!owner_email || !group_name) {
        console.log('Missing fields');
        return res.status(400).json({ error: "Owner email and group name are required" });
    }

    try {
        const accountResult = await pool.query(
            'SELECT * FROM account WHERE email = $1',
            [owner_email]
        );

        if (accountResult.rows.length === 0) {
            console.log('Owner email not found');
            return res.status(400).json({ error: "Owner email not found in the account database" });
        }

        const groupResult = await pool.query(
        `INSERT INTO my_groups (owner_email, group_name) VALUES ($1, $2) RETURNING id, group_name`,
        [owner_email, group_name]
        );

        const group_id = groupResult.rows[0].id;
        const groupName = groupResult.rows[0].group_name;

        await pool.query(
            'INSERT INTO group_members (group_id, member_email) VALUES ($1, $2)',
            [group_id, owner_email]
        );

        console.log("New Group created:", { id: group_id, group_name: groupName });
        res.status(201).json({ id: group_id, group_name: groupName, owner_email: owner_email });
    } catch (err) {
        console.error('Error creating group:', err.message);
        res.status(500).json({ error: 'Failed to create group' });
    }
};

//delete group
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    console.log('Received request to delete group with:', req.params);

    try {
        const deleteResult = await pool.query(
            'DELETE FROM my_groups WHERE id = $1',
            [groupId]
        )
        
        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        console.error('Error deleting group:', err);
        res.status(500).json({ error: 'Failed to delete group' });
    }
};


//join group
const joinGroup = async (req, res) => {
    const { groupId } = req.params;
    const { member_email } = req.body;

    if (!groupId ||!member_email) {
        return res.status(400).json({ error: "Group ID and member email are required" });
    }

    try {
        const checkQuery = 'SELECT 1 FROM group_members WHERE group_id = $1 AND member_email = $2';
        const checkResult = await pool.query(checkQuery, [groupId, member_email]);

        if (checkResult.rowCount > 0) {
            return res.status(400).json({ error: "Member is already part of the group" });
        }

        const insertQuery =`INSERT INTO group_members (group_id, member_email) VALUES ($1, $2)`;
        await pool.query(insertQuery, [groupId, member_email]);

        res.status(200).json({ message: "Member joined the group successfully" });
    } catch (err) {
    console.log('Error deleting group', err);
    res.status(500).json({ error: 'Failed to join group' });
    }
};

//remove member
const removeMember = async (req, res) => {
    const { groupId, member_email } = req.params;

    try {
        const removeResult = await pool.query(
            'DELETE FROM group_members WHERE group_id = $1 AND member_email = $2 RETURNING *',
            [groupId, member_email]
        );

        if (removeResult.rowCount === 0) {
            return res.status(404).json({ error: 'Member not found in this group' });
        }

        await pool.query('DELETE FROM join_requests WHERE group_id = $1 AND request_email = $2', [groupId, member_email]);

        res.status(200).json({ message: 'Member removed from group successfully' });
    } catch (err) {
        console.error('Error removing member:', err);
        res.status(500).json({ error: 'Failed to remove member from group' });
    }
};

//leave group
const leaveGroup = async (req, res) => {
    const { groupId, member_email } = req.params;

    if (!groupId || !member_email) {
        return res.status(400).json({ error: 'Group ID and member email are required' });
    }

    try {
        const leaveResult = await pool.query(
            'DELETE FROM group_members WHERE group_id = $1 AND member_email = $2 RETURNING *',
            [groupId, member_email]
        );

        if (leaveResult.rowCount === 0) {
            return res.status(404).json({ error: 'Member not found in the group' });
        }

        await pool.query('DELETE FROM join_requests WHERE group_id = $1 AND request_email = $2', [groupId, member_email]);

        res.status(200).json({ message: "Member left the group successfully" });
    } catch (err) {
        console.error('Error leaving group:', err);
        res.status(500).json({ error: 'Failed to leave group' });
    }
};

//fetch group members
const fetchAllMembers = async (req, res) => {
    try {
        const fetchQuery = 'SELECT member_email FROM group_members WHERE group_id = $1';

        const result = await pool.query(fetchQuery, [req.params.groupId]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch group members' });
    }
};



//join request handling:

//sending request
const sendJoinRequest = async (req, res) => {
    console.log("Request parameters:", req.params);
    console.log("Request body:", req.body);

    const { groupId } = req.params;
    const { request_email } = req.body;

    console.log("Received join request with groupId:", groupId, "and request_email:", request_email);

    if (!groupId || !request_email) {
        return res.status(400).json({ error: "Group ID and request email are required" });
    }

    try {
        //check if the user is already a member
        const checkQuery = 'SELECT 1 FROM group_members WHERE group_id = $1 AND member_email = $2';
        const checkResult = await pool.query(checkQuery, [groupId, request_email]);

        if (checkResult.rowCount > 0) {
            return res.status(400).json({ error: "User is already a member of this group" });
        }

        //check if request already exists
        const requestCheckQuery = 'SELECT status FROM join_requests WHERE group_id = $1 AND request_email = $2';
        const requestCheckResult = await pool.query(requestCheckQuery, [groupId, request_email]);

        if (requestCheckResult.rowCount > 0) {
            const requestStatus = requestCheckResult.rows[0].status;

            //reset request
            if (requestStatus === 'DECLINED') {
                await pool.query('UPDATE join_requests SET status = $3 WHERE group_id = $1 AND request_email = $2 AND status = $4', [groupId, request_email, 'PENDING', 'DECLINED']);
                return res.status(200).json({ error: "Your previous request was declined. You may try again." });
            }

            if (requestStatus === 'PENDING') {
                return res.status(400).json({ error: "Join request is already sent." });
            }
        }

        //new request
        const insertQuery = 'INSERT INTO join_requests (group_id, request_email, status) VALUES ($1, $2, $3)';
        await pool.query(insertQuery, [groupId, request_email, 'PENDING']);

        res.status(200).json({ message: 'Join request sent successfully' });
    } catch (err) {
        console.error('Error sending join request:', err.message);
        res.status(500).json({ error: 'Failed to send join request' });
    }
};

//accepting request
const acceptJoinRequest = async (req, res) => {
    const { groupId, requestEmail } = req.params;

    try {
        //update request status
        const updateQuery = 'UPDATE join_requests SET status = $1 WHERE group_id = $2 AND request_email = $3';
        const result = await pool.query(updateQuery, ['ACCEPTED', groupId, requestEmail]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Join request not found' });
        }

        await pool.query('INSERT INTO group_members (group_id, member_email) VALUES ($1, $2)', [groupId, requestEmail]);

        res.status(200).json({ message: 'Join request accepted, member added to group' });
    } catch (err) {
        console.error('Error accepting join request:', err.message);
        res.status(500).json({ error: 'Failed to accept join request' });
    }
};

//declining request
const declineJoinRequest = async (req, res) => {
    const { groupId, requestEmail } = req.params;

    try {
        //update request status
        const updateQuery = 'UPDATE join_requests SET status = $1 WHERE group_id = $2 AND request_email = $3';
        const result = await pool.query(updateQuery, ['DECLINED', groupId, requestEmail]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Join request not found' });
        }

        res.status(200).json({ message: 'Join request declined' });
    } catch (err) {
        console.error('Error declining join request:', err.message);
        res.status(500).json({ error: 'Failed to decline join request' });
    }
};

//fetch requests
const fetchJoinRequests = async (req, res) => {
    const { groupId } = req.params;

    try {
        const fetchQuery = 'SELECT request_email, status FROM join_requests WHERE group_id = $1 AND status = $2';
        const result = await pool.query(fetchQuery, [groupId, 'PENDING']);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching join requests:', err.message);
        res.status(500).json({ error: 'Failed to fetch join requests' });
    }
};

export { fetchAllGroups, createGroup, deleteGroup, joinGroup, removeMember, leaveGroup, fetchAllMembers, fetchUserGroups, sendJoinRequest, acceptJoinRequest, declineJoinRequest, fetchJoinRequests };