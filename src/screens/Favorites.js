import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Accordion, Container, Image, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import PaginationComp from '../components/Pagination.js';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Favorites.css';

export default function Favorites() {
  
  const [favouriteData, setFavouriteData] = useState([])
  const [page, setPage] = useState(1)

  const itemsPerPage = 5
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = favouriteData.slice(startIndex, endIndex)

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

      {favouriteData.length === 0 ? (
        <p>No favourite movies available.</p>
      ) : (
        <Accordion className="whole-box">
          {paginatedData.map((favourite, index) => (
            <Accordion.Item className="accordion-box" eventKey={index.toString()} key={index}>
              <Accordion.Header>
                <Image src={account_icon_placeholder} roundedCircle></Image>
                {favourite.email}'s list of favourite movies
              </Accordion.Header>
              <Accordion.Body>
                {favourite.movie.map((movie, idx) => (
                  <strong key={idx}>
                    <li>{movie}</li>
                  </strong>
                ))}
                <Navbar className="navBox">
                  <Container>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                      <Nav>
                        <NavDropdown>
                          <NavDropdown.Item href="/account">View account</NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <PaginationComp
        total={Math.ceil(favouriteData.length / itemsPerPage)}
        current={page}
        onChange={(newPage) => setPage(newPage)}
      />
    </div>
  )
}