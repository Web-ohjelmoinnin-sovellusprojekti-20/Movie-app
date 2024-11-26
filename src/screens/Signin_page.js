import './Sign_in_up.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from '../context/useAccount.js';

export default function Signin() {

    const { account, setAccount, signIn, setIsLoggedIn } = useAccount();
    const navigate = useNavigate();
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        await signIn();
        navigate('/');
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
        const message = error.response && error.response.data ? error.response.data.error : error;
        alert(message);
      }
    };

    return (

    <div className="page-centered">
    <Container className="d-inline-flex p2">
        <div>
            <h3>Please sign in to get full access to all features!</h3>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-0 me-2 flex-grow-1">
                <label>Username or email</label>
            <Form.Control type="text" placeholder="Enter your username or email" onChange={e => setAccount({...account,email: e.target.value})}/>
                <label>Password</label>
            <Form.Control type="text" placeholder="Enter your password" onChange={e => setAccount({...account, password: e.target.value})}/>
            <div>
            <Link to="/signup">Forgot your username or password? Click here</Link>
            </div>
            <Button type='submit'>Login</Button>
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