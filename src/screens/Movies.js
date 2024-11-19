import './Movies.css';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import { getMovieByName } from '../components/movieAPI';

//TODO: search for movies, if there's one show, if there's none say there's none with such name
export default function Movies() {

  const [movie, setMovie] = useState('')
  const [result, setResult] = useState('')
  const [moviesData, setmoviesData] = useState('')


  const searchHandle = async (e) => {
      e.preventDefault();
      setResult("You searched for " + movie + ". Displaying results..")

      try {
        const data = await getMovieByName(movie)
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
        <Form.Check 
        type='checkbox'
        label='Check'
        />
        <Form.Check 
        type='checkbox'
        label='Check'
        />
        </Dropdown.Menu>
      </Dropdown>
      </Form>
      <label>{result}</label>
      <pre>
      {moviesData && (
        moviesData.map((movie) => (
        <div>
        <pre>
          {JSON.stringify(movie,null,2)}
        </pre>
        </div>
        ))
      )}
      </pre>
    </div>
  );
}
