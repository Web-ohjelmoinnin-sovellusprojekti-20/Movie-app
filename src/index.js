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
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './screens/Signup_page.js';
import Signin from './screens/Signin_page.js';
import Group_page from './screens/Group_page.js';
import Account from './screens/Account.js';
import ErrorPage from './screens/ErrorPage.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import AccountProvider from './context/AccountProvider.js';

// TODO: Add routes for different elements
const router = createBrowserRouter([
  {
    errorElement: <ErrorPage></ErrorPage>
  },
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
  },
  {
    path: '/signup',
    element: <Signup></Signup>
  },
  {
    path: '/signin',
    element: <Signin></Signin>
  },
  {
    element: <ProtectedRoute></ProtectedRoute>,
    children: [
      {
        path: '/account',
        element: <Account></Account>
      },
      {
        path: '/group_page',
        element: <Group_page></Group_page>
      },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AccountProvider>
      <Header />
      <RouterProvider router={router}></RouterProvider>
    </AccountProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
