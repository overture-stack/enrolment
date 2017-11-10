import React from 'react';
import { connect } from 'react-redux';

import GoogleLoginForm from './components/GoogleLoginForm';
import InternalLoginForm from './components/InternalLoginForm';
import LoginStatus from './components/LoginStatus';

import './login.scss';
import logo from '../../assets/img/logo.svg';

import { I18n } from 'react-i18next';

const Login = props => {
  const { isGoogleLogin, auth: { error } } = props;

  const activeLanguageClass = (currentLang, button) => {
    if (currentLang === button) return 'active';
  };

  return (
    <I18n ns="translations">
      {(t, { i18n }) => (
        <div className="login">
          <div className="login-logo-container">
            <img src={logo} className="login-logo" alt="logo" />
          </div>
          {isGoogleLogin ? <GoogleLoginForm /> : <InternalLoginForm />}
          {error ? <LoginStatus /> : null}
          <div>
            <button
              className={activeLanguageClass(i18n.language, 'en')}
              onClick={() => i18n.changeLanguage('en')}
            >
              en
            </button>
            <button
              className={activeLanguageClass(i18n.language, 'fr')}
              onClick={() => i18n.changeLanguage('fr')}
            >
              fr
            </button>
          </div>
        </div>
      )}
    </I18n>
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
