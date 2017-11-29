import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import GoogleLoginForm from './components/GoogleLoginForm';
import InternalLoginForm from './components/InternalLoginForm';
import LoginStatus from './components/LoginStatus';

import './login.scss';
import logo from '../../assets/img/logo.svg';

class Login extends Component {
  static displayName = 'Login';

  render() {
    const { t, i18n, isGoogleLogin, auth: { error } } = this.props;

    const activeLanguageClass = (currentLang, button) => {
      if (currentLang === button) return 'btn btn-default btn-toggles active';

      return 'btn btn-default btn-toggles';
    };

    return (
      <div className="login">
        <div className="login-logo-container">
          <img src={logo} className="login-logo" alt="logo" />
        </div>
        <div className="login-title">
          <h2>{t('Login.title')}</h2>
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
  }
}

const mapStateToProps = state => {
  return {
    isGoogleLogin: state.login.isGoogleLogin,
    auth: state.auth,
  };
};

export default translate()(withRouter(connect(mapStateToProps, null)(Login)));
