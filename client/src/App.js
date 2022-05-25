import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useRoutes,
} from "react-router-dom";

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Slices
import { loadUser } from './slices/user';

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useSelector } from 'react-redux';
import routes from './components/routing/PrivateRoute';

// Check if user has token
if (localStorage.token) {
  localStorage.setItem("token", localStorage.token);
}

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
  }, []);

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;