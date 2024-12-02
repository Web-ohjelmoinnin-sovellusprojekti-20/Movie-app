import { pool } from '../helpers/db.js';


const getFavourites = async(req, res) => {
    try {
        const query = 'SELECT email, UNNEST(movie_name) AS movie_name FROM favorite'
        const result = await pool.query(query)
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({ error: 'fail in getting favourite movies'})
    }
}
/*
const favouriteAppend = async(req, res) => {
    try {
        const { email, movie_name } = req.body
        const query = 'UPDATE favorite SET movie_name = array_append(movie_name, $1), current_visibility = 'VISIBLE' WHERE email = $2'
        const result = await pool.query(query, [movie_name, email])
        
        if (result.rowCount === 0) {
            res.status(404).json({error: error})
        } else {
            res.status(200).json()
        }
    } catch (error) {
        res.status(500).json({ error: 'fail in adding a favourite movie'})
    }
}
*/
export { getFavourites };

