import React, { useState } from 'react';
import { Accordion, Button, Image } from 'react-bootstrap';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Favorites.css';

export default function Favorites() {
  
  const [favouriteData, setFavouriteData] = useState([])

  const addUser = (email, movies) => { //lisää lista, ei lisää duplikaatti email listoja
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
  }

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
      
      <Button onClick={() => addUser('val.val@gmail.com')}>Add user without movies</Button>
      <Button onClick={() => addUser('put.put@gmail.fi', ['Avatar', 'Titanic'])}>Add user with movies</Button>
      <Button onClick={() => addMovieToUser('val.val@gmail.com', ['Terrifier'])}>Add movie to val's list</Button>
      <Button onClick={() => addMovieToUser('put.put@gmail.fi', ['Monsters'])}>Add movie to put's list</Button>
      
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