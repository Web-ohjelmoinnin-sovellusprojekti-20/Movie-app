import axios from 'axios';

const url = 'https://api.themoviedb.org/3/search/movie?query='
const key = '&api_key=e39b43c4f5b8bda212cacb543bd29bad'
// const url = 'https://api.themoviedb.org/3/search/movie?query=lion&language=en-US&page=1';
// https://developer.themoviedb.org/reference/search-movie KESKEINEN!

const getMovieByName = async (name, genreIds) => {
    try {
        const response = await axios.get(url + name + '&language=en-US&page=1' + key )
        console.log({name})
        let movies = response.data.results
        if (genreIds.length > 0) {
            console.log("Tässä on testi:" + genreIds)
            movies = movies.filter(movie => {
                const flatIds = movie.genre_ids.flat();
                if (movie.genre_ids.length === 0) {
                    return false;
                }
                 return flatIds.every(genreId => genreIds.includes(genreId))
            }
            );
            console.log("Tässä on testi 2")          
          }
          console.log("Tässä on testi 3")
        return movies.sort((a,b) => b.popularity - a.popularity )
    }
    catch(error){
        throw error
    }
}

export { getMovieByName }
