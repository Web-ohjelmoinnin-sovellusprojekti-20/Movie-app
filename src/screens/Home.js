import React, { useCallback, useState } from 'react';
import { Carousel, Form, Modal } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { getMovieByName } from '../components/movieAPI';
import placeholderImage from '../images/placeholder-img.png';
import './Home.css';
export default function Home() {

  const [movie, setMovie] = useState('')
  const [moviesData, setmoviesData] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState({})
  const [modalShow, setModalShow] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState (null)
  const [arrowsVisible, setArrowsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)

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
        console.log({moviesData})
        setmoviesData(null);
      }
      else{
        console.log({movie})
        console.log({moviesData})
        const genreIds = Object.keys(selectedGenres).filter(genre => selectedGenres[genre]).map(genre => genreMap[genre])

      try {
          const data = await getMovieByName(movie, genreIds, currentPage)
          const parsedData = JSON.parse(data)
          console.log(parsedData.total_pages)
        if(parsedData != ''){
          setmoviesData(parsedData.movies)

        }
        else{
          setmoviesData(null)
        }
        console.log("testi");
      }
      catch(error){
          setmoviesData(null)
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

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex)
  }

  return (
    <div>
      <h2 className="text-center">Search movies for a quick overview</h2>
      <Form onSubmit={searchHandle} className="form-submit">
        <div 
          className="div1"
        >
          <Form.Control
            type="text"
            placeholder="Search for movies here"
            style={{ width: '15%' }}
            value={movie}
            onChange={handleInputChange}
        />
        <Dropdown title="Test" id="test-dropdown">
          <Dropdown.Toggle id="dropdown-basic" variant="secondary">
            Filters
        </Dropdown.Toggle>
        <Dropdown.Menu onClick={(e) => e.stopPropagation()}>
          {[
            'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
            'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
            'TV Movie', 'Thriller', 'War', 'Western'
          ].map((genre) => (
            <Form.Check
              type="checkbox"
              key={genre}
              label={genre}
              checked={selectedGenres[genre] || false}
              onChange={() => handleCheckChange(genre)}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
    <div>
      {moviesData && <h3>{moviesData[activeIndex]?.title}</h3>}
    </div>
  </Form>


      <div>
        <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
          {moviesData && moviesData.map((movie, index) => (
            <Carousel.Item key={index}>
              <div
                className="div2"
                onClick={() => {
                  setSelectedMovie(movie)
                  setModalShow(true)
                }}
              >
                <img
                  className="img-fluid poster-img"
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImage}
                  alt={movie.title}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        <MovieModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          movie={selectedMovie}
          genreMap={genreMap}
        />
      </div>
    </div>
  );

  function MovieModal(props) {
    const {movie, genreMap} = props

    if (!movie) {
      return null
    }

    const reverseMap = {}

    Object.keys(genreMap).forEach(genre => {
      const genreId = genreMap[genre]
      reverseMap[genreId] = genre
    })

    return (
      <Modal {...props} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <strong>{movie.title}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3><strong>About</strong></h3>
          <p>{movie.overview}</p>
        </Modal.Body>
        <Modal.Footer className="MovieTags justify-content-lg-start"></Modal.Footer>
      </Modal>
    )
  }
}