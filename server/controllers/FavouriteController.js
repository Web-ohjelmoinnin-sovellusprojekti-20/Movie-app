import { appendToFavorite, deleteFromFavorite, getVisibleFavorites } from '../models/Favorite.js';

/*
const initializeEmail = async(req, res) => {
    try {
        const { email } = req.body
        const query = `
            INSERT INTO FAVORITE (email)
            VALUES ($1)
        `
        await pool.query(query, [email])
        res.status(200).json({ message: "Email initialized in favorites"})
    } catch (error) {
        res.status(500).json({error})
    }
}
*/
const getFavourites = async(req, res) => {
    try {
        const result = await getVisibleFavorites();
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error);
    }
}

const appendList = async(req, res, next) => {
    try {
        const { email, movie_name } = req.body
        
        await appendToFavorite(email,movie_name);
        return res.status(200).json({ message: "Favourite list updated succesfully"})
    } catch (error) {
        return next(error);
    }
}

const removeFromList = async(req, res, next) => {
    try {
        const { email, movie_name } = req.body
        
        await deleteFromFavorite(email, movie_name);
        return res.status(200).json({ message: "Movie succesfully removed from favourites"})
    } catch (error) {
        return next(error);
    }
}

export { appendList, getFavourites, removeFromList };

