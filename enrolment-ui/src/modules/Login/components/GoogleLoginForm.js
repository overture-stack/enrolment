import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { createGoogleLoginFunctions } from '../../Auth/redux';

import GoogleLoginButton from './GoogleLoginButton';
import ChangeLogin from './ChangeLogin';

const GoogleLoginForm = props => {

  const {
    googleLoginFunctions: {
      onSuccess,
      onFailure
    }
  } = props;

  const login = useGoogleLogin({
    onSuccess: onSuccess,
    onError: onFailure,
    flow: 'implicit',
  });

  return (
    <div className="login-container">
      <GoogleLoginButton onClick={login} />
      <ChangeLogin />
    </div>
  );
};

GoogleLoginForm.displayName = 'GoogleLoginForm';

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    googleLoginFunctions: createGoogleLoginFunctions(dispatch),
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(GoogleLoginForm));
