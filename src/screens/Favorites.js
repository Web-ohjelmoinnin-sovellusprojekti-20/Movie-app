import React, { useState } from 'react';
import { Button, Container, Form, Image, Stack } from 'react-bootstrap';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Favorites.css';

export default function Favorites() {
  const [favourites, setFavourites] = useState([])
  const [favouriteField, setFavouriteField] = useState({display: 'none'})
  const [favouriteButton, setFavouriteButton] = useState(false)

  const getDate = () => {
    const date = new Date()

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const currentDate = (day + '.' + month + '.' + year)

    return currentDate
  }

  const handleFavouriteButton = () => {
    setFavouriteField({ display: 'block'})
    setFavouriteButton(true)
  }

  const handleAddFavourite = (e) => {
    e.preventDefault()
    const date = getDate()

    const favourite = {
      ...favourite,
      dateTime: date
    }

    setFavourites(favourite)
    //jatka myöhemmi
  }

  const handleCancelButton = () => {
    setFavouriteField({ display: 'none' })
    setFavouriteButton(false)
    //
  }

  return (
    <Container>
      <div>
        <h6>Make sure you're signed in to add a favourite</h6>
        <Button
          variant="secondary"
          disabled={favouriteButton}
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
            >
            </Form.Control>

            <br/>

            <Form.Label>Movie</Form.Label>
            <Form.Control
              placeholder="Enter movie"
            >
            </Form.Control>

            <br/>

            <Form.Label>Thoughts</Form.Label>
            <Form.Control
              placeholder="Give your thoughts about the movie"
            >
            </Form.Control>

            <br/>

            <div>
              <Button variant="primary">
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

      <div>
        <Stack gap={2}>
          {
            favourites.map(favourites => (
              <div>
              
                <div>
                  <Image src={account_icon_placeholder} roundedCircle></Image>
                  <span>{favourites}</span> //email
                </div>

                <div> //date
                  {favourites}
                </div>

                <div> //movie
                  {favourites}
                </div>

                <div> //short words
                  {favourites}
                </div>

              </div>
            ))
          }
        </Stack>
      </div>
    </Container>
  );
}
