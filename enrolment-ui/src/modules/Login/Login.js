import React from 'react';

import './login.scss';
import logo from '../../assets/img/logo.svg';

const Login = () => {
  return (
    <div className="login">
      <div className="login-logo-container">
        <img src={logo} className="login-logo" alt="logo" />
      </div>
    </div>
  );
};

Login.displayName = 'Login';

export default Login;
