import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Image } from 'react-bootstrap';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Favorites.css';

export default function Favorites() {
  
  const [favouriteData, setFavouriteData] = useState([])

  useEffect(() => {
    const getFavouriteMovies = async() => {
      try {
        const response = await axios.get('http://localhost:3001/favourites/favourites')
        const data = response.data

        data.forEach(({ email, movie_name }) => {
          addMovieToUser(email, Array.isArray(movie_name) ? movie_name : [movie_name])
        })
      } catch (error) {
        throw error
      }
    }
    getFavouriteMovies()
  }, [])

const addMovieToUser = (email, movies) => {
  setFavouriteData((prevData) => {
    const existingUser = prevData.find(user => user.email === email);

    if (existingUser) {
      const updatedMovies = [
        ...new Set([...existingUser.movie, ...movies])
      ]

      return prevData.map(user =>
        user.email === email ? { ...user, movie: updatedMovies } : user
      )
    } else {
      return [...prevData, { email, movie: movies }]
    };
  })
}

  return (

    <div>
      <h1>Shared favourite movies</h1>
      
      <Accordion className="whole-box">
        {favouriteData.map((favourite, index) => (
          <Accordion.Item className="accordion-box" eventKey={index.toString()} key={index}>
            <Accordion.Header>
              <Image src={account_icon_placeholder} roundedCircle></Image>
              {favourite.email}'s list of favourite movies
            </Accordion.Header>
            <Accordion.Body>
                {favourite.movie.map((movie, idx) => (
                  <strong><li key={idx}>{movie}</li></strong>
                ))}
                <br/>
                <Button>View profile</Button>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

    </div>
  )
}