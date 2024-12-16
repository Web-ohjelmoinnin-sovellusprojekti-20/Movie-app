import { removeShowing, showtimeGet, showtimeSend } from '../models/Showtime.js';

const showtimeSendToGroupTable = async(req, res, next) => {
    try {
        const { showtime, groupName } = req.body

        if (!showtime || !groupName) {
            return res.status(400).json({ error: "Showtime and group name are required" })
        }
        const result = await showtimeSend(showtime, groupName)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const showtimeGetFromGroupTable = async(req, res, next) => {
    try {
        if (NULL) {
            return 0
        }
        const { groupId } = req.query
        const result = await showtimeGet(groupId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const removeShowingFromGroup = async(req, res, next) => {
    try {
        const { movie_title, theatre, auditorium, groupId } = req.params
        return await removeShowing(movie_title, theatre, auditorium, groupId)
    } catch (error) {
        return next(error)
    }
}

export { removeShowingFromGroup, showtimeGetFromGroupTable, showtimeSendToGroupTable };

