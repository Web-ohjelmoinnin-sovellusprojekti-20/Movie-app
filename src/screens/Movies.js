import './Movies.css';
import React, { useCallback, useState } from 'react';
import { Form, Card, Row, Col, Container, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import { getMovieByName } from '../components/movieAPI';
import placeholderImage from '../images/placeholder-img.png';
//TODO: Pagination
export default function Movies() {

  const [movie, setMovie] = useState('')
  const [result, setResult] = useState('')
  const [moviesData, setmoviesData] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState({})
  const [modalShow, setModalShow] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState (null)
  const [actionIcons, setActionIcons] = useState ({})
  const [currentPage, setCurrentPage] = useState (1)
  const [totalPages, setTotalPages] = useState (1)

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

// Voisi searchata pelkästään genrejen avulla
  const searchHandle = async (e) => {
      e.preventDefault();
      if(movie == ''){
        setResult("Please type in a keyword to search with.")
        console.log({moviesData})
        setmoviesData(null);
        setTotalPages(1)
      }
      else{
        setResult("You searched for " + movie + ".")
        console.log({movie})
        console.log({moviesData})
        const genreIds = Object.keys(selectedGenres).filter(genre => selectedGenres[genre]).map(genre => genreMap[genre])

      try {
          const data = await getMovieByName(movie, genreIds, currentPage)
        if(data != ''){
          setResult("Displaying results for " + movie + "...")
          setmoviesData(data)
          setTotalPages(data.total_pages)
        }
        else{
          setResult("No results found for " + movie + ".")
          setmoviesData(null)
          setTotalPages(1)
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

  const handleIconClick = (movieId, icon) => {
        setActionIcons((prevState) =>({
          ...prevState,
          [movieId]: {
          ...prevState[movieId],
          [icon]: !prevState[movieId]?.[icon],
        },
      }))
  }

  const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
        searchHandle(new Event('submit'))
      }
  }

  return (
    <div>Movies
      <Form onSubmit={searchHandle}>
        <Form.Control type="text" placeholder='Type here...'
          className="mt2"
          value = {movie}
          onChange={handleInputChange}
        /> 
      </Form>
      <Form>
      <Dropdown title="Test"
          id="test-dpdown"
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

      <label>{result}</label>

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
              className={`bi ${actionIcons[movie.id]?.star ? 'bi-star-fill' : 'bi-star'}`} 
              onClick={(e) => {e.stopPropagation(); handleIconClick(movie.id,'star');}}
            ></i>
            <i 
              className={`bi ${actionIcons[movie.id]?.heart ? 'bi-heart-fill' : 'bi-heart'}`}
              onClick={(e) => {e.stopPropagation(); handleIconClick(movie.id,'heart');}}
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
      <Pagination className='pageList justify-content-center'>
        <Pagination.First /> 
        <Pagination.Prev /> 
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Next />
        <Pagination.Last />
    </Pagination>
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

  const reverseMap = Object.entries(genreMap).reduce((acc, [name, id]) => {
    acc[id] = name;
    return acc;
  })

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
