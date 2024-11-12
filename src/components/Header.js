import './Header.css';
import React from 'react';

// TODO: Add links to different pages
export default function Header() {
  return (
    <header>
        <div className='links'>
            <a href='/'>Home</a>
            <a href='/movies'>Movies</a>
            <a href='/showtimes'>Showtimes</a>
            <a href='/favorites'>Favorites</a>
            <a href='/reviews'>Reviews</a>
            <a href='/groups'>Groups</a>
        </div>
        <div className='account-icon'>
            Account icon goes here
        </div>
    </header>
  );
}
