import { pool } from '../helpers/db.js';

const showtimeSend = async(showing, groupName) => {
    try {
        const query = `
            UPDATE my_groups
            SET showtime = array_append(showtime, $1::jsonb)
            WHERE group_name = $2
        `

        const formattedShowtime = {
            movie_title: showing.title,
            auditorium: showing.auditorium,
            starts: showing.formattedTime,
            theatre: showing.theatre,
        }

        return await pool.query(query, [formattedShowtime, groupName])
    } catch (error) {
        console.error('Error sending showtime data to db', error)
        throw new Error('Database error')
    }
}

const showtimeGet = async(groupId) => {
    try {
        const query = `
            SELECT showtime
            FROM my_groups
            WHERE id = $1
        `

        const result = await pool.query(query, [groupId])
        return result
    } catch (error) {
        console.error('Error getting showtimes data from db', error)
        throw new Error('Database error')
    }
}

const removeShowing = async(movie_title, theatre, auditorium, groupId) => {
    try {
        const query = `
            UPDATE my_groups
            SET showtime = ARRAY(
                SELECT jsonb_agg(showtime)
                FROM (
                    SELECT showtime
                    FROM unnest(showtime) AS showtime
                    WHERE showtime->>'movie_title' = $1
                    AND showtime->>'theatre' = $2
                    AND showtime->>'auditorium' = $3
                ) AS filtered_showtimes
            )
            WHERE id = $4
        `
        return await pool.query(query, [movie_title, theatre, auditorium, groupId])
    } catch (error) {
        console.error('Error in removing', error)
        throw new Error('Db error')
    }
}

export { removeShowing, showtimeGet, showtimeSend };

