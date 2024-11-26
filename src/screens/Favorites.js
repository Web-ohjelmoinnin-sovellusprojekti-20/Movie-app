import React, { useState } from 'react';
import { Button, Container, Form, Image, NavDropdown, Stack } from 'react-bootstrap';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Favorites.css';


export default function Favorites() {
  const [favourites, setFavourites] = useState([])
  const [favouriteField, setFavouriteField] = useState({display: 'none'})
  const [isFavouriteButton, setIsFavouriteButton] = useState(false)

  const [favourite, setFavourite] = useState({
    email: '',
    movie: '',
    words: '',
    dateTime: ''
  })

  const resetFavourites = () => {
    setFavourite({
      email: '',
      movie: '',
      words: '',
      dateTime: ''
    })
  }

  const handleChange = (field, value) => {
    setFavourite((previousFavourite) => ({
      ...previousFavourite,
      [field] : value
    }))
  }

  const getDate = () => {
    const date = new Date()

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const currentDate = (day + '.' + month + '.' + year)

    return currentDate
  }

  const handleFavouriteButton = () => {
    setFavouriteField({ display: 'block'})
    setIsFavouriteButton(true)
  }

  const handleAddFavourite = (e) => {
    e.preventDefault()
    const date = getDate()

    const newFavourite = {
      ...favourite,
      dateTime: date
    }

    setFavourite(favourite)
    setFavourites((previousFavourite) => [...previousFavourite, newFavourite])
    resetFavourites()
  }

  const handleCancelButton = () => {
    setFavouriteField({ display: 'none' })
    setIsFavouriteButton(false)
    resetFavourites()
  }

  return (
    <Container>
      <div className="box1">
        <h6>Make sure you're signed in to add a favourite</h6>
        <Button
          variant="secondary"
          disabled={isFavouriteButton}
          onClick={handleFavouriteButton}
        >
          Add a favourite
        </Button>

        <Form
          style={favouriteField}
        >
          <br/>
          <Form.Group>
            
            <Form.Label>Email</Form.Label>
            <Form.Control
              placeholder="Enter email"
              value={favourite.email}
              onChange={(event) => handleChange('email', event.target.value)}
            >
            </Form.Control>

            <br/>

            <Form.Label>Movie</Form.Label>
            <Form.Control
              placeholder="Enter movie"
              type="movie"
              value={favourite.movie}
              onChange={(event) => handleChange('movie', event.target.value)}
            >
            </Form.Control>

            <br/>

            <Form.Label>Thoughts</Form.Label>
            <Form.Control
              placeholder="Share your thoughts about the movie"
              type="text"
              value={favourite.words}
              onChange={(event) => handleChange('words', event.target.value)}
            >
            </Form.Control>

            <br/>

            <div className="buttons">
              <Button
              variant="primary"
              onClick={handleAddFavourite}
              >
                Add
              </Button>

              <Button
              variant="secondary"
              onClick={handleCancelButton}
              >
                Cancel
              </Button>
            </div>

          </Form.Group>

        </Form>
      </div>

      <br/>

      <div>
        <Stack className="box2" gap={1}>
          {
            favourites.map(Favourite => (
              <div className="box3">

                <div>
                  <NavDropdown title={<Image src={account_icon_placeholder}></Image>} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/account">View account</NavDropdown.Item>
                  </NavDropdown>
                </div>

                <div>
                <strong>{Favourite['email']}</strong>
                </div>
            
                <div>
                  <strong>{Favourite['dateTime']}</strong>
                </div>

                <div>
                  <strong>{Favourite['movie']}</strong>
                </div>

                <div>
                  <strong>{Favourite['words']}</strong>
                </div>

              </div>
            ))
          }
        </Stack>
      </div>
    </Container>
  );
}
