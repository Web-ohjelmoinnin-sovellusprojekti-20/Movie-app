import './Movies.css';
import React, { useState } from 'react';
import { Nav, Navbar, Button, Form } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'

//TODO: search for movies, if there's one show, if there's none say there's none with such name
export default function Movies() {

  const [movie, setMovie] = useState('')
  const [result, setResult] = useState('')


  function searchHandle (e){
      e.preventDefault();
      setResult("You searched for " + movie)
  }


  return (
    <div>Movies
      <Form onSubmit={searchHandle}>
        <Form.Control type="text" placeholder='Type here...'
        className="mt2"
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
    </div>
  );
}
