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
          //addUser(email, [])
          addMovieToUser(email, Array.isArray(movie_name) ? movie_name : [movie_name])
        })
      } catch (error) {
        throw error
      }
    }
    getFavouriteMovies()
  }, [])

 /* const addUser = (email, movies) => { //lisää lista, ei lisää duplikaatti email listoja
    setFavouriteData((prevData) => {
      const userExists = prevData.some((user) => user.email === email)

      if (userExists) {
        return prevData
      }
      
      return [
        ...prevData,
        {
          email: email,
          movie: movies || []
        }
      ]
    })
  } */

  const addMovieToUser = (email, movies) => { //lisää elokuva(t) tiettyyn listaan
    setFavouriteData((prevData) => {
      const userIndex = prevData.findIndex((user) => user.email === email)

      if (userIndex !== -1) {
        const updatedUser = {
          ...prevData[userIndex],
          movie: [...prevData[userIndex].movie, ...movies]
        }
        return [
          ...prevData.slice(0, userIndex),
          updatedUser,
          ...prevData.slice(userIndex + 1)
        ]
      } else {
        return [
          ...prevData,
          {
            email: email,
            movie: movies
          }
        ]
      }
    })
  }

  return (

    <div>
      <h1>Shared favourite movies</h1>
      
      <Accordion>
        {favouriteData.map((favourite, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
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