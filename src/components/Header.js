import React from 'react';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Header.css';

export default function Header() {
  return (
    <header>
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='me-auto'>
            <Nav.Link href='/'>Home</Nav.Link>
            <Nav.Link href='/movies'>Movies</Nav.Link>
            <Nav.Link href='/showtimes'>Showtimes</Nav.Link>
            <Nav.Link href='/favorites'>Favorites</Nav.Link>
            <Nav.Link href='/reviews'>Reviews</Nav.Link>
            <Nav.Link href='/groups'>Groups</Nav.Link>
          </Nav>
          <Nav className="me-auto">
            <NavDropdown title={<Image src={account_icon_placeholder}></Image>} id="basic-nav-dropdown">
              <NavDropdown.Item href="/account">Account</NavDropdown.Item>
              <NavDropdown.Item href="/signup">Sign up</NavDropdown.Item>
              <NavDropdown.Item href="/signin">Sign in</NavDropdown.Item>
              <NavDropdown.Item href="/myfavorites">My favorites</NavDropdown.Item>
              <NavDropdown.Item id='logout-btn' href="/logout">Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  );
}
