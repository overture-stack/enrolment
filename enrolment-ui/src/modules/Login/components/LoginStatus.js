import React from 'react';
import { connect } from 'react-redux';

import spinner from '../../../assets/img/spinner.svg';

const errorText = error => {
  const {
      details,
      response,
  } = error;

  return details || (
    response
      ? (
        console.error('Login error:', response.data),
        `${response.status} - ${response.statusText}`
      )
    : error);
};

const LoginStatus = props => {
  const { loading, error } = props.auth;
  return (
    <div className={`login-extra-info ${loading || error ? 'show' : 'hide'} `}>
      {loading && <img className="loading-graphic" src={spinner} alt="loading graphic" />}
      {error && (
        <div
          className="alert alert-danger"
          >
          {errorText(error)}
          </div>
      )}
    </div>
  );
};

LoginStatus.displayName = 'LoginStatus';

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(LoginStatus);
