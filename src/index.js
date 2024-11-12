import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './screens/Home';
import reportWebVitals from './reportWebVitals';
import Header from './components/Header.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Movies from './screens/Movies.js';
import Showtimes from './screens/Showtimes.js';
import Favorites from './screens/Favorites.js';
import Reviews from './screens/Reviews.js';
import Groups from './screens/Groups.js';

// TODO: Add routes for different elements
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home></Home>
  },
  {
    path: '/movies',
    element: <Movies></Movies>
  },
  {
    path: '/showtimes',
    element: <Showtimes></Showtimes>
  },
  {
    path: '/favorites',
    element: <Favorites></Favorites>
  },
  {
    path: '/reviews',
    element: <Reviews></Reviews>
  },
  {
    path: '/groups',
    element: <Groups></Groups>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />  {/* Add Header component here */}
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
