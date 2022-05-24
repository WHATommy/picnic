import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import RouteController from './components/routing/RouteController';

// Components
import Login from './components/auth/Login';

// Slices
import { loadUser } from './slices/user';

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

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
        <Route path="/" element={ <Login /> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;