import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import GoogleLoginForm from './components/GoogleLoginForm';
import InternalLoginForm from './components/InternalLoginForm';
import LoginStatus from './components/LoginStatus';

import './login.scss';
import logo from '../../assets/img/logo.svg';

const Login = props => {
  const { i18n, isGoogleLogin, auth: { error } } = props;

  const activeLanguageClass = (currentLang, button) => {
    if (currentLang === button) return 'btn btn-default btn-toggles active';

    return 'btn btn-default btn-toggles';
  };

  return (
    <div className="login">
      <div className="login-logo-container">
        <img src={logo} className="login-logo" alt="logo" />
      </div>
      {isGoogleLogin ? <GoogleLoginForm /> : <InternalLoginForm />}
      {error ? <LoginStatus /> : null}
      <div className="lang-toggle">
        <button
          className={activeLanguageClass(i18n.language, 'en')}
          onClick={() => i18n.changeLanguage('en')}
        >
          EN
        </button>
        <button
          className={activeLanguageClass(i18n.language, 'fr')}
          onClick={() => i18n.changeLanguage('fr')}
        >
          FR
        </button>
      </div>
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

export default translate()(connect(mapStateToProps, null)(Login));
