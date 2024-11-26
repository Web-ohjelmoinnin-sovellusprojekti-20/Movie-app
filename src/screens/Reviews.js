import React, { useState } from 'react';
import { Button, Container, Form, Image, Stack } from 'react-bootstrap';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import './Reviews.css';

export default function Reviews() {
  const [review, setReview] = useState({
    id: Math.floor(Math.random() * 1000000),
    email: '',
    'movie-name': '',
    content: '',
    rating: '0',
    datetime: ''
  });
  const [reviewFormVisibility, setReviewFormVisibility] = useState({
    display: 'none'
  });
  const [reviewButtonDisabled, setReviewButtonDisabled] = useState(false);
  const [reviews, setReviews] = useState([]);

  const getCurrentDate = () => {
    const currentDate = new Date();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November','December'];
    const currentDay = currentDate.getDate();
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    const currentDateString = currentDay + ' ' + currentMonth + ' ' + currentYear;

    return currentDateString;
  }

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
      id: Math.floor(Math.random() * 1000000),
      email: '',
      'movie-name': '',
      content: '',
      rating: '0',
      datetime: ''
    });
  };

  const cancelReview = () => {
    setReviewFormVisibility({ display: 'none' });
    setReviewButtonDisabled(false);
    resetReview();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = getCurrentDate();
    console.log(currentDate);
    const updatedReview = {
      ...review,
      datetime: currentDate
    };
    console.log(updatedReview);
    setReview(updatedReview);
    setReviews((prevReviews) => [...prevReviews, updatedReview]);

    resetReview();
  };

  return (
    <Container>
      <div className='review-addition-box container'>
        <h6>Please sign in to leave a review</h6>
        <Button
          variant='secondary'
          id='review-addition-button'
          disabled={reviewButtonDisabled}
          onClick={handleReviewButtonPress}
        >
          Add a review
        </Button>
        <Form
          className='review-form mt-2'
          style={reviewFormVisibility}
          onSubmit={handleSubmit}
        >
          {/* The email part should be removed once the backend can handle user authurization */}
          <Form.Group className='mb-3' controlId='reviewEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter your email'
              value={review['email']}
              onChange={(event) => handleChange('email', event.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='reviewMovieName'>
            <Form.Label>Movie Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the movie name'
              value={review['movie-name']}
              onChange={(event) =>
                handleChange('movie-name', event.target.value)
              }
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='reviewContent'>
            <Form.Label>Review Content</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter your review content'
              value={review['content']}
              onChange={(event) => handleChange('content', event.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='reviewRating'>
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type='range'
              min='1'
              max='5'
              value={review['rating']}
              onChange={(event) => handleChange('rating', event.target.value)}
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
              <div className='review'>
                <div className='account-email'>
                  <Image src={account_icon_placeholder} roundedCircle />
                  <span>{review['email']}</span>
                </div>
                <div className='review-date'>
                  {review['datetime']}
                </div>
                <div className='review-movie'>
                  {review['movie-name']}
                </div>
                <div className='review-content'>
                  {review['content']}
                </div>
                <div className='review-rating'>
                  {review['rating']}/5 Stars
                </div>
              </div>
            ))
          }
        </Stack>
      </div>
    </Container>
  );
}
