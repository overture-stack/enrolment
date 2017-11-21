import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import GoogleLoginForm from './components/GoogleLoginForm';
import InternalLoginForm from './components/InternalLoginForm';
import LoginStatus from './components/LoginStatus';

import { checkUserRequest, resetLoginState } from './redux';

import './login.scss';
import logo from '../../assets/img/logo.svg';

class Login extends Component {
  static displayName = 'Login';

  constructor(props) {
    super(props);

    // If we are on the register-user route, check
    // whether the request is still valid or not
    if (props.match.path === '/register-user/:id/:projectId') {
      props.checkUserRequest(props.match.params.id);
    } else {
      props.resetLoginState();
    }
  }

  invalidRequestRender() {
    const { t } = this.props;

    return (
      <div className="login">
        <div className="login-logo-container">
          <img src={logo} className="login-logo" alt="logo" />
        </div>
        <div className="alert alert-danger">{t('Login.invalidUserRequest')}</div>
      </div>
    );
  }

  render() {
    const { i18n, isGoogleLogin, isUserRequestValid, auth: { error } } = this.props;

    const activeLanguageClass = (currentLang, button) => {
      if (currentLang === button) return 'btn btn-default btn-toggles active';

      return 'btn btn-default btn-toggles';
    };

    if (!isUserRequestValid) return this.invalidRequestRender();

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
  }
}

const mapStateToProps = state => {
  return {
    isGoogleLogin: state.login.isGoogleLogin,
    isUserRequestValid: state.login.isUserRequestValid,
    auth: state.auth,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    checkUserRequest: id => checkUserRequest(dispatch, id),
    resetLoginState: () => dispatch(resetLoginState()),
  };
};

export default translate()(withRouter(connect(mapStateToProps, mapDispatchToProps)(Login)));
