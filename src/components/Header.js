import './Header.css';
import React from 'react';
import account_icon_placeholder from '../images/account_icon_placeholder.png';

// TODO: Add links to different pages
export default function Header() {
  return (
    <header>
      <div className='navbar'>
        <div className='links'>
          <a href='/'>Home</a>
          <a href='/movies'>Movies</a>
          <a href='/showtimes'>Showtimes</a>
          <a href='/favorites'>Favorites</a>
          <a href='/reviews'>Reviews</a>
          <a href='/groups'>Groups</a>
        </div>
        <div className='dropdown' id='account-icon'>
          <button className='dropbtn'>
            <img src={account_icon_placeholder}></img>
          </button>
        </div>
      </div>
    </header>
  );
}
