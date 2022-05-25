import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useRoutes,
} from "react-router-dom";

// Routing
import PublicRoute from "./components/routing/PublicRoute";
import PrivateRoute from "./components/routing/PrivateRoute";

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Test from "./components/dashboard/test";

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
        <Route path="/" element={<PublicRoute/>}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>       

        <Route path="/" element={<PrivateRoute/>}>
            <Route path="/test" element={<Test />} />
            <Route path="/dashboard" element={<Test />} />
        </Route> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;