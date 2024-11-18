import './Sign_in_up.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Signup() {

    const [] = useState([]);
    const [] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    return (

    <div className="page-centered">
    <Container className="d-inline-flex p2">
        <div>
            <h3>Please sign up to get full access to all features!</h3>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-0 me-2 flex-grow-1">
                <label>Username</label>
            <Form.Control type="text" placeholder="Choose your username"/>
                <label>Email</label>
            <Form.Control type="text" placeholder="Enter your email"/>
                <label>Password</label>
            <Form.Control type="text" placeholder="Choose your password"/>
                <div className="text-muted">
                <label>Strong password has to include...</label>
                <li>at least 8 characters</li>
                <li>at least 1 capital letter</li>
                <li>at least 1 number</li>
                </div>
            <Button>Create account</Button>
            <div>
            <Link to="/signin">Already have an account? Sign in here!</Link>
            </div>
            </Form.Group>
        </Form>
        </div>
    </Container>
    </div>
    );
};