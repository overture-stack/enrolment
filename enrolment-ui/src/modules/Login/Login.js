import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { getOneConfig } from '../../config';

import GoogleLoginForm from './components/GoogleLoginForm';
import InternalLoginForm from './components/InternalLoginForm';
import LoginStatus from './components/LoginStatus';

import './login.scss';
import logo from '../../assets/img/logo.svg';

const { multiLingual } = getOneConfig('multiLingual');

const activeLanguageClass = (currentLang, button) => {
  if (currentLang === button) return 'btn btn-default btn-toggles active';

  return 'btn btn-default btn-toggles';
};

const Login = ({
    auth: { error },
    i18n,
    isGoogleLogin,
    t,
}) => {
  const renderLanguagePicker = () => {
    return (
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
    );
  };

  return (
    <div className="login container">
      <div className="login-logo-container">
        <img src={logo} className="login-logo" alt="logo" />
      </div>
      <div className="login-title">
        <h2>{t('Login.title')}</h2>
      </div>
      {isGoogleLogin ? <GoogleLoginForm /> : <InternalLoginForm />}
      {error ? <LoginStatus /> : null}
      {multiLingual ? renderLanguagePicker() : null}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isGoogleLogin: state.login.isGoogleLogin,
    auth: state.auth,
  };
};

export default withTranslation()(withRouter(connect(mapStateToProps, null)(Login)));
