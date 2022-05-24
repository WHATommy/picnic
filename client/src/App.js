import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RouteController from './components/routing/RouteController';
import Login from './components/auth/Login';
import { LOGOUT } from './actions/types';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './util/setAuthToken';
import { loadUser } from './actions/auth';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      store.dispatch(loadUser());
    }
  }, []);

  return(
    <Provider store={store}>
      <Router>
        <Fragment>
          <Routes>
            <Route exact path="/" component={Login}/>
            <Route component={RouteController}/>
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;