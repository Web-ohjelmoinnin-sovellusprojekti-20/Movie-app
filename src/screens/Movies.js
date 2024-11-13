import './Movies.css';
import React, { useState } from 'react';
//TODO: dropdown list!
export default function Movies() {
  const [movie, setMovie] = useState('')
  const [result, setResult] = useState('')
    function searchHandle (e){
      e.preventDefault();
      setResult("You searched for " + movie)
  }
  function dropHandle(){
    document.getElementById("dropdown").classList.toggle("show")
  }
  return (
    <div>Movies
      <search>
      <form onSubmit={searchHandle}>
        <input placeholder='Type here...'
        value={movie}
        onChange={e => setMovie(e.target.value)}
        /> 
        <button
        title="Search"
        />
      </form>
      <div className = "dropdown">
          <button onClick={dropHandle}></button>
          <div id = "dropdown" class = "dropdown-list">
            <input type='checkbox' id="check1" value="Check1"></input>
            <label for="check1">Checkbox number juan</label>
            <input type='checkbox' id="check2" value="Check2"></input>
            <label for="check2">Checkbox number dos</label>
          </div>
        </div>
      </search>
      <label>{result}</label>
    </div>
  );
}
