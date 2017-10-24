import React from 'react';
import { connect } from 'react-redux';

import GoogleLoginForm from './components/GoogleLoginForm';
import InternalLoginForm from './components/InternalLoginForm';

import './login.scss';
import logo from '../../assets/img/logo.svg';

const Login = props => {
  const { isGoogleLogin } = props;

  return (
    <div className="login">
      <div className="login-logo-container">
        <img src={logo} className="login-logo" alt="logo" />
      </div>
      {isGoogleLogin ? <GoogleLoginForm /> : <InternalLoginForm />}
    </div>
  );
};

Login.displayName = 'Login';

const mapStateToProps = state => {
  return {
    isGoogleLogin: state.login.isGoogleLogin,
  };
};

export default connect(mapStateToProps, null)(Login);
