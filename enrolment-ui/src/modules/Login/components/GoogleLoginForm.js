import React from 'react';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getOneConfig } from '../../../config';
import { createGoogleLoginFunctions } from '../../Auth/redux';

import ChangeLogin from './ChangeLogin';

const GoogleLoginForm = props => {
  const { clientId } = getOneConfig('clientId');

  const { t, auth: { loading }, googleLoginFunctions: { onRequest, onSuccess, onFailure } } = props;

  return (
    <div className="login-container">
      <GoogleLogin
        className={`login-google ${loading ? 'disabled' : ''}`}
        buttonText={t('GoogleLogin.buttonText')}
        clientId={clientId}
        onRequest={onRequest}
        onSuccess={onSuccess}
        onFailure={onFailure}
        disabled={loading}
      />
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

export default translate()(connect(mapStateToProps, mapDispatchToProps)(GoogleLoginForm));
