import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

// Maps auth state to props for routes
const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

// Only allows access to route if user logged in
export const PrivateRoute = connect(
  mapStateToProps,
  null,
)(({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      )}
  />
));

// Only allows access to route if user logged out
export const OnlyNonLoggedInRoute = connect(
  mapStateToProps,
  null,
)(({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // Special redirect case for new users
      const { match: { path, params: { id = '', projectId = '' } } } = props;
      const redirect =
        path === '/register-user/:projectId/:id/'
          ? `/register/user/${projectId}/${id}/`
          : '/dashboard';

      return !auth.isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: redirect, state: { from: props.location } }} />
      );
    }}
  />
));
