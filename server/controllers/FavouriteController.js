import { pool } from '../helpers/db.js';


const getFavourites = async(req, res) => {
    try {
        const query = `
            SELECT email, UNNEST(movie_name) AS movie_name
            FROM favorite
            WHERE current_visibility = 'VISIBLE';
        `
        const result = await pool.query(query)
        res.status(200).json(result.rows)
        console.log(query, result.rows)
    } catch (error) {
        res.status(500).json({error})
    }
}

const appendList = async(req, res) => {
    try {
        const { email, movie_name } = req.body
        const query = `
            UPDATE favorite
            SET movie_name = array_append(movie_name, $1),
                current_visibility = 'VISIBLE'
            WHERE email = $2
        `
        await pool.query(query, [movie_name, email])
        res.status(200).json({ message: "Favourite list updated succesfully"})
    } catch (error) {
        res.status(500).json({error})
    }
}

const removeFromList = async(req, res) => {
    try {
        const { email, movie_name } = req.body
        const query = `
            UPDATE favorite
            SET movie_name = array_remove(movie_name, $1)
            WHERE email = $2
        `
        await pool.query(query, [movie_name, email])
        res.status(200).json({ message: "Movie succesfully removed from favourites"})
    } catch (error) {
        res.status(500).json({error})
    }
}

export { appendList, getFavourites, removeFromList };

