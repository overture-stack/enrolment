import React from 'react';
import { connect } from 'react-redux';

import GoogleLoginForm from './components/GoogleLoginForm';
import InternalLoginForm from './components/InternalLoginForm';
import LoginStatus from './components/LoginStatus';

import './login.scss';
import logo from '../../assets/img/logo.svg';

const Login = props => {
  const { isGoogleLogin, auth: { error } } = props;

  return (
    <div className="login">
      <div className="login-logo-container">
        <img src={logo} className="login-logo" alt="logo" />
      </div>
      {isGoogleLogin ? <GoogleLoginForm /> : <InternalLoginForm />}
      {error ? <LoginStatus /> : null}
    </div>
  );
};

Login.displayName = 'Login';

const mapStateToProps = state => {
  return {
    isGoogleLogin: state.login.isGoogleLogin,
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(Login);
