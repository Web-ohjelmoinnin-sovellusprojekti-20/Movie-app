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
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch groups' });
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

        const groupId = groupResult.rows[0].id;
        const groupName = groupResult.rows[0].group_name;

        await pool.query(
            'INSERT INTO group_members (group_id, member_email) VALUES ($1, $2)',
            [groupId, owner_email]
        );

        console.log("New Group created:", { id: groupId, group_name: groupName });
        res.status(201).json({ id: groupId, group_name: groupName });
    } catch (err) {
        console.error('Error creating group:', err.message);
        res.status(500).json({ error: 'Failed to create group' });
    }
};

//delete group
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const deleteResult = await pool.query(
            'DELETE FROM my_groups WHERE id = $1 RETURNING *',
            [groupId]
        )

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        await pool.query(
            'DELETE FROM group_members WHERE group_owner_email = $1',
            [groupId]
        );

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        console.error('Error deleting group:', err);
        res.status(500).json({ error: 'Failed to delete group' });
    }
};


//join group
const joinGroup = async (req, res) => {
    const { group_owner_email, member_email } = req.body;

    if (!group_owner_email ||!member_email) {
        return res.status(400).json({ error: "Group owner email and member email are required" });
    }

    try {
        const checkQuery = 'SELECT 1 FROM group_members WHERE group_owner_email = $1 AND member_email = $2';
        const checkResult = await pool.query(checkQuery, [group_owner_email, member_email]);

        if (checkResult.rowCount > 0) {
            return res.status(400).json({ error: "Member is already part of the group" });
        }

        const insertQuery =
        `INSERT INTO group_members (group_owner_email, member_email) VALUES ($1, $2)`;

        await pool.query(insertQuery, [group_owner_email, member_email]);

        res.status(200).json({ message: "Member joined the group successfully" });
    } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to join group' });
    }
};

//remove member
const removeMember = async (req, res) => {
    const { groupId, memberId } = req.params;

    try {
        const removeResult = await pool.query(
            'DELETE FROM group_members WHERE group_owner_email = $1 AND member_email = $2 RETURNING *',
            [groupId, memberId]
        );

        if (removeResult.rowCount === 0) {
            return res.status(404).json({ error: 'Member not found in this group' });
        }

        res.status(200).json({ message: 'Member removed from group successfully' });
    } catch (err) {
        console.error('Error removing member:', err);
        res.status(500).json({ error: 'Failed to remove member from group' });
    }
};


export { fetchAllGroups, createGroup, deleteGroup, joinGroup, removeMember };