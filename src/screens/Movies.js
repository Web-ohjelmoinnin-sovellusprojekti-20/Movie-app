import './Movies.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Form, Card, Row, Col, Container, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import { getMovieByName } from '../components/movieAPI';
import placeholderImage from '../images/placeholder-img.png';
import { useAccount } from '../context/useAccount.js'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Movies() {

  const [movie, setMovie] = useState('')
  const [result, setResult] = useState('')
  const [moviesData, setmoviesData] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState({})
  const [modalShow, setModalShow] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState (null)
  const [currentPage, setCurrentPage] = useState (1)
  const [totalPages, setTotalPages] = useState (1)
  const [showPages, setShowPages] = useState (false)
  const {account} = useAccount();
  const navigate = useNavigate();

useEffect(() => {
  if (currentPage >= 1 && currentPage <= totalPages) {
    searchHandle(new Event('submit'));
  }
}, [currentPage]); 


  const genreMap = {
    'Action': 28,
    'Adventure': 12,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'History': 36,
    'Horror': 27,
    'Music': 10402,
    'Mystery': 9648,
    'Romance': 10749,
    'Science Fiction': 878,
    'TV Movie': 10770,
    'Thriller': 53,
    'War': 10752,
    'Western': 37
  };


  const searchHandle = async (e) => {
      e.preventDefault();
      if(movie == ''){
        setResult("Please type in a keyword to search with.")
        console.log({moviesData})
        setmoviesData(null);
        setTotalPages(1)
        setShowPages(false)
      }
      else{
        setResult("You searched for " + movie + ".")
        console.log({movie})
        console.log({moviesData})
        const genreIds = Object.keys(selectedGenres).filter(genre => selectedGenres[genre]).map(genre => genreMap[genre])

      try {
          const data = await getMovieByName(movie, genreIds, currentPage)
          const parsedData = JSON.parse(data)
          console.log(parsedData.total_pages)
          console.log(currentPage)
        if(parsedData != ''){
          setResult("Displaying results for " + movie + "...")
          setmoviesData(parsedData.movies)
          setTotalPages(parsedData.total_pages)
          setShowPages(true)
        }
        else{
          setResult("No results found for " + movie + ".")
          setmoviesData(null)
          setTotalPages(1)
          setShowPages(false)
        }
        console.log("testi");
      }
      catch(error){
          setmoviesData(null)
          setTotalPages(1)
      };
    }

  }

  const handleInputChange = (e) => {
    setMovie(e.target.value);
  };

  const handleCheckChange = useCallback((genre) => {
        setSelectedGenres(prevState => ({
          ...prevState,
          [genre]: !prevState[genre],
        }))
      
  }, [])



  const handleIconClick = async (movie, icon) => {

      try {

        const favResponse = await axios.get('http://localhost:3001/favourites/favourites');
        const favoriteMovies = favResponse.data
        .filter(fav => fav.email === account.email) 
        .map(fav => fav.movie_name); 

        const isFavorite = favoriteMovies.includes(movie.title);

        if (icon === 'heart') {
          if (isFavorite) {
            alert("The movie " + movie.title + " has been removed from your favourites.");
            await axios.delete('http://localhost:3001/favourites/remove', {
                data: { email: account.email, movie_name: movie.title }
            });
        } else {
            alert("The movie " + movie.title + " was added to your favourites!");
            await axios.post('http://localhost:3001/favourites/append', {
                email: account.email,
                movie_name: movie.title
            });
        }
    }
      if (icon === 'star' && account.email) {
        console.log("Redirecting to the Reviews page with the movie " + movie.id)
          console.log("star checked")
          alert("Redirecting you to the Reviews-page...")
          navigate("/reviews",{ state: { movie_name: movie.title, formVisible: true } });
      }
      if(!account.email) {
        alert("Please sign in.")
      }
  }
    catch(err){
    console.error('Error fetching or updating favorites:', err);
  }
}

  const handlePageChange = (newPage) => {
    console.log("tuleva"+newPage)
    console.log("nykynen"+currentPage)
    console.log(totalPages)
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
        console.log(newPage)
      }
  }

  const pageLimiter = () => {
    const maxPagesBefore = 5
    const maxPagesAfter = 5   
    let startPage = Math.max(currentPage - maxPagesBefore, 1)
    let endPage = Math.min(currentPage + maxPagesAfter, totalPages)
  
    if (currentPage - startPage < maxPagesBefore) {
      endPage = Math.min(endPage + (maxPagesBefore - (currentPage - startPage)), totalPages)
    }
  
    if (endPage - currentPage < maxPagesAfter) {
      startPage = Math.max(startPage - (maxPagesAfter - (endPage - currentPage)), 1)
    }
  
    const limitedPages = []
    for (let i = startPage; i <= endPage; i++) {
      limitedPages.push(i)
    }
  
    return limitedPages
  }

  return (
    <div>
      <h3 className='pageTitle'><strong>Movies</strong></h3>
      <div className="searchProperties">
      <Form onSubmit={searchHandle}>
        <Form.Control type="text" placeholder='Type here to search for movies...'
          className="searchBar"
          value = {movie}
          onChange={handleInputChange}
        /> 
      </Form>
      <Form>
      <Dropdown title="Test"
          id="test-dpdown"
          className="filterMenu"
        >
        <Dropdown.Toggle id="dropdown-basic"
          variant="secondary">
          Filters
      </Dropdown.Toggle>
        <Dropdown.Menu onClick={(e) => e.stopPropagation()}>
          {[
            'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
            'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
            'TV Movie', 'Thriller', 'War', 'Western'
          ].map(genre => (
        <Form.Check 
          className='checkBoxes'
          type='checkbox'
          key={genre}
          label={genre}
          checked={selectedGenres[genre] || false}
          onChange={() => handleCheckChange(genre)}
        />
        ))}   
        </Dropdown.Menu>
      </Dropdown>
      </Form>
      </div>

      <label className='searchResults'>{result}</label>

      <Container>
          <Row>
            {moviesData && (
              moviesData.map((movie) => (
            <Col lg={3} md={3} sm={6} xs={12}>
            <Card onClick={() => {
              setModalShow(true)
              setSelectedMovie(movie)
            }}>
              <div className='image-container'> 
          <Card.Img src= {movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImage} fluid
          />
            <div className='icons-overlay'>
            <i 
              className={'bi-star-fill'} 
              onClick={(e) => {e.stopPropagation(); handleIconClick(movie,'star');}}
            ></i>
            <i 
              className={'bi-heart-fill'}
              onClick={(e) => {e.stopPropagation(); handleIconClick(movie,'heart');}}
            ></i>
          </div>
          <Card.Title className='movieTitle justify-content-center '>{movie.title}</Card.Title>
          </div>
        </Card>
        </Col>
        ))
      )}
      </Row>
      </Container>  
      {showPages && (  
      <Pagination className='pageList justify-content-center'>
        <Pagination.First onClick={() => handlePageChange(1)}/> 
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)}/> 
        {pageLimiter().map((pageIndex) => (
        <Pagination.Item
          key={pageIndex}
          active={pageIndex === currentPage}
          onClick={() => handlePageChange(pageIndex)}
        >
          {pageIndex}
        </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => {handlePageChange(currentPage + 1); console.log("clicked" + currentPage)
        }}/>
        <Pagination.Last onClick={() => handlePageChange(totalPages)}/>
      </Pagination>
      )}
      <MovieCardModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          movie={selectedMovie}
          genreMap={genreMap}
        />
    </div>
  );
}



function MovieCardModal (props)  {
  const {movie, genreMap} = props
  if (!movie) return null;

  const reverseMap = {};
  Object.keys(genreMap).forEach(genre => {
    const genreId = genreMap[genre];
    reverseMap[genreId] = genre;   
  });

  const modalGenres = movie.genre_ids.map(id => reverseMap[id]).join(', ')

  return (
  <Modal
  {...props}
  centered>
    <Modal.Header closeButton>
      <Modal.Title>
        <strong>{movie.title}</strong>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <h4><strong>About this movie</strong>
    </h4>
    <p>
    {movie.overview}
    </p>
    <p>
      <strong>Release Date :</strong> {movie.release_date}
    </p>
    </Modal.Body>
    <Modal.Footer className='MovieTags justify-content-lg-start'>
      <i className="bi bi-tags"></i>
      {modalGenres}
    </Modal.Footer>
  </Modal>
  )
}

//{JSON.stringify(movie,null,2)} ! Jos tarvitsee nähdä JSONit
