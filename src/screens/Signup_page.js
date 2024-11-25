import './Sign_in_up.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from '../context/useAccount.js';


export default function Signup() {

    const { account, setAccount, signUp} = useAccount();
    const [ validated, setValidated ] = useState(false);
    const navigate = useNavigate();

    const isPasswordValid = () => {
        const password = account.password;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d){8,}$/;
        return passwordRegex.test(password);
    };
  
    const handleSubmit = async(e) => {
        e.preventDefault();
      try {
        await signUp();
        navigate('/signin');
      } catch (error) {
        const message = error.response && error.response.data ? error.response.data.error : error;
        alert(message);
      }
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
            <Form.Control type="text" placeholder="Enter your email" onChange={e => setAccount({...account, email: e.target.value})}/>
                <label>Password</label>
            <Form.Control type="text" placeholder="Choose your password" onChange={e => setAccount({...account, password: e.target.value})}/>
                <div className="text-muted">
                <label>Strong password has to include...</label>
                <li>at least 8 characters</li>
                <li>at least 1 capital letter</li>
                <li>at least 1 number</li>
                </div>
            <Button type='submit'>Create account</Button>
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