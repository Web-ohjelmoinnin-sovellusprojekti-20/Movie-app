import './Movies.css';
import React, { useCallback, useState } from 'react';
import { Form, Card, Row, Col, Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import { getMovieByName } from '../components/movieAPI';
//TODO: Ei elokuvia notifikaatio,
export default function Movies() {

  const [movie, setMovie] = useState('')
  const [result, setResult] = useState('')
  const [moviesData, setmoviesData] = useState('')
  const [selectedGenres, setSelectedGenres] = useState({})

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
      setResult("You searched for " + movie + ". Displaying results..")
      const genreIds = Object.keys(selectedGenres).filter(genre => selectedGenres[genre]).map(genre => genreMap[genre])

      try {
        const data = await getMovieByName(movie, genreIds)
        setmoviesData(data)
        console.log("testi");
      }
      catch(error){
        setmoviesData(null)
      };

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
        <Card>
          <Card.Img src= {`https://image.tmdb.org/t/p/w500${movie.poster_path}`} fluid/>
          <Card.Title>{movie.original_title}</Card.Title>
          {JSON.stringify(movie,null,2)}
        </Card>
        </Col>
        ))
      )}
      </Row>
      </Container>
    </div>
  );
}

//{JSON.stringify(movie,null,2)} ! Jos tarvitsee nähdä JSONit
