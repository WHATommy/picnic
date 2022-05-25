import React from 'react';

import {Navigate, Outlet} from 'react-router-dom'

const useAuth = () => {
  const token = localStorage.getItem('token')
  if(token){
    return true
  } else {
    return false
  }
}

const PublicRoutes=(props) =>{
  const auth = useAuth()
  return auth ? <Navigate to="/dashboard"/> : <Outlet/>
}

export default PublicRoutes;