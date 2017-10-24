import React from 'react';
import GoogleLogin from 'react-google-login';

import ChangeLogin from './ChangeLogin';

const GoogleLoginForm = props => {
  return (
    <div className="login-container">
      <GoogleLogin
        className={'login-google' /*`login-google ${auth.isFetching ? 'disabled' : ''}`*/}
        buttonText=""
        clientId={0 /*clientId*/}
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
