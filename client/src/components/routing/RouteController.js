import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Register from '../auth/Register';
import Login from '../auth/Login';

import PrivateRoute from './PrivateRoute';

const RouteController = props => {
    return (
        <section>
            <Routes>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login} />
            </Routes>
        </section>
    );
};

export default RouteController