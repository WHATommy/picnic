// React
import React, { useEffect } from 'react';

// Routing
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./components/routing/PublicRoute";
import PrivateRoute from "./components/routing/PrivateRoute";

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import { NotFoundPage } from './components/NotFoundPage';

// Slices
import { loadUser } from './slices/user';

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@popperjs/core";
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
    <div className="font-link">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<PublicRoute/>}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>       

          <Route path="/" element={<PrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:userId/:tripId" element={<Dashboard />} />
            <Route path="/dashboard/:userId/:tripId/:contentType" element={<Dashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route> 

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;