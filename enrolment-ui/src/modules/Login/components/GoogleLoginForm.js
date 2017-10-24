import React from 'react';
import GoogleLogin from 'react-google-login';

import { getOneConfig } from '../../../config';

import ChangeLogin from './ChangeLogin';

const GoogleLoginForm = props => {
  const { clientId } = getOneConfig('clientId');

  return (
    <div className="login-container">
      <GoogleLogin
        className={'login-google' /*`login-google ${auth.isFetching ? 'disabled' : ''}`*/}
        buttonText=""
        clientId={clientId}
        onRequest={() => console.log('REQUEST')}
        onSuccess={response => console.log(response)}
        onFailure={error => console.log(error)}
        disabled={false /*auth.isFetching*/}
      />
      <ChangeLogin />
    </div>
  );
};

GoogleLoginForm.displayName = 'GoogleLoginForm';

export default GoogleLoginForm;
