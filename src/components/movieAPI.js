import axios from 'axios';

const url = 'https://api.themoviedb.org/3/search/movie?query='
const key = '&api_key=e39b43c4f5b8bda212cacb543bd29bad'
// const url = 'https://api.themoviedb.org/3/search/movie?query=lion&language=en-US&page=1';
// https://developer.themoviedb.org/reference/search-movie KESKEINEN!

const getMovieByName = async (name, genreIds, Page) => {
    try {
        console.log(genreIds)
        const response = await axios.get(url + name + '&language=en-US&page=' + Page + key )
        let movies = response.data.results
        if (genreIds.length > 0) {
            movies = movies.filter(movie => {
                const flatIds = movie.genre_ids.flat();
                if (movie.genre_ids.length === 0) {
                    return false;
                }
                 return flatIds.some(genreId => genreIds.includes(genreId))
            }
            );       
          }
        return movies.sort((a,b) => b.popularity - a.popularity )
    }
    catch(error){
        throw error
    }
}

export { getMovieByName }
