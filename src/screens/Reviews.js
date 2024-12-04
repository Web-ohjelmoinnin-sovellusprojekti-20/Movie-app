import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Image, Stack } from 'react-bootstrap';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Reviews.css';
import { useAccount } from '../context/useAccount.js';
import axios from 'axios';
import { render } from '@testing-library/react';

export default function Reviews() {
  const { isLoggedIn, account } = useAccount();
  const [review, setReview] = useState({
    id: undefined,
    email: account.email ? account.email : undefined,
    'movie_name': '',
    review_text: '',
    stars: '0',
    date: ''
  });
  const [reviewFormVisibility, setReviewFormVisibility] = useState({
    display: 'none'
  });
  const [reviewButtonDisabled, setReviewButtonDisabled] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const response = await axios.get(process.env.REACT_APP_API_URL + '/review/all');
    console.log(response);
    setReviews(response.data);
  };

  const addReview = async () => {
    const email = account.email;
    const movieName = review['movie_name'];
    const reviewText = review['review_text'];
    const stars = review['stars'];

    console.log(account.token);

    if (!movieName || !reviewText || !stars) {
      alert('Please fill in all fields');
      return;
    }

    const review_to_add = {
      email: email,
      movie_name: movieName,
      review_text: reviewText,
      stars: stars
    };

    if (!email) {
      alert('Please log in to add a review');
      return;
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + '/review/create',
        review_to_add,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: account.token
          }
        }
      );
    } catch (error) {
      console.error(error);
      alert('Failed to add review. Please try again later.');
    }
  };


  useEffect(() => {
    fetchReviews();
  }, [reviewFormVisibility]);

  

  const handleReviewButtonPress = () => {
    setReviewFormVisibility({ display: 'block' });
    setReviewButtonDisabled(true);
  };

  const handleChange = (field, value) => {
    setReview((prevReview) => ({
      ...prevReview,
      [field]: value
    }));
  };

  const resetReview = () => {
    setReview({
      id: undefined,
      email: account.email ? account.email : undefined,
      'movie_name': '',
      review_text: '',
      stars: '0',
      date: ''
    });
  };

  const cancelReview = () => {
    setReviewFormVisibility({ display: 'none' });
    setReviewButtonDisabled(false);
    resetReview();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addReview();

    cancelReview();
  };

  return (
    <Container>
      <div className='review-addition-box container'>
        {isLoggedIn ? (
          <h6>Leave a review</h6>
        ) : (
          <h6>Please sign in to leave a review</h6>
        )}
        <Button
          variant='secondary'
          id='review-addition-button'
          disabled={!isLoggedIn ? true : reviewButtonDisabled}
          onClick={handleReviewButtonPress}
        >
          Add a review
        </Button>
        <Form
          className='review-form mt-2'
          style={reviewFormVisibility}
          onSubmit={handleSubmit}
        >
          <Form.Group className='mb-3' controlId='reviewMovieName'>
            <Form.Label>Movie Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the movie name'
              value={review['movie_name']}
              onChange={(event) =>
                handleChange('movie_name', event.target.value)
              }
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='reviewContent'>
            <Form.Label>Review Content</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter your review content'
              value={review['review_text']}
              onChange={(event) => handleChange('review_text', event.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='reviewRating'>
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type='range'
              min='1'
              max='5'
              value={review['stars']}
              onChange={(event) => handleChange('stars', event.target.value)}
            />
            <Form.Text className='text-muted'>
              Please select a rating between 1 and 5.
            </Form.Text>
          </Form.Group>
          <div>
            <Button className='submit-button' variant='primary' type='submit'>
              Submit
            </Button>
            <Button variant='secondary' type='cancel' onClick={cancelReview}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>

      <div>
        <h4>Reviews submitted by users</h4>
        <Stack className='review-list' gap={2}>
          {
            reviews.map(review => (
              <div className='review' id={review['id']} key={review['id']}>
                <div className='account-email'>
                  <Image src={account_icon_placeholder} roundedCircle />
                  <span>{review['email']}</span>
                </div>
                <div className='review-date'>
                  {review['date']}
                </div>
                <div className='review-movie'>
                  {review['movie_name']}
                </div>
                <div className='review-content'>
                  {review['review_text']}
                </div>
                <div className='review-rating'>
                  {review['stars']}/5 Stars
                </div>
              </div>
            ))
          }
        </Stack>
      </div>
    </Container>
  );
}
