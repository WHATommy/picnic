import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      (
      <Route
      {...rest}
        render={props =>
          loading ? (
            <h1>LOADING...</h1>
          ) : isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Navigate to="/login" />
          )
      }
      />
    )}
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  session: state.session
});

export default connect(mapStateToProps)(PrivateRoute);