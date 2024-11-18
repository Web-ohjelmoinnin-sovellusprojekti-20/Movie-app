import './Sign_in_up.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Signin() {

    const [] = useState([]);
    const [] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    return (

    <div className="page-centered">
    <Container className="d-inline-flex p2">
        <div>
            <h3>Please sign in to get full access to all features!</h3>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-0 me-2 flex-grow-1">
                <label>Username or email</label>
            <Form.Control type="text" placeholder="Enter your username or email"/>
                <label>Password</label>
            <Form.Control type="text" placeholder="Enter your password"/>
            <div>
            <Link to="/signup">Forgot your username or password? Click here</Link>
            </div>
            <Button>Login</Button>
            <div>
            <Link to="/signup">Don't have an account? Sign up here!</Link>
            </div>
            </Form.Group>
        </Form>
        </div>
    </Container>
    </div>
    );
};