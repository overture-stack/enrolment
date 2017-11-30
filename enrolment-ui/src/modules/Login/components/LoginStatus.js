import React from 'react';
import { connect } from 'react-redux';

import spinner from '../../../assets/img/spinner.svg';

const LoginStatus = props => {
  const { loading, error } = props.auth;
  return (
    <div className={`login-extra-info ${loading || error ? 'show' : 'hide'} `}>
      {loading && <img className="loading-graphic" src={spinner} alt="loading graphic" />}
      {error && (
        <div
          className="alert alert-danger"
          dangerouslySetInnerHTML={{ __html: error.details || error }}
        />
      )}
    </div>
  );
};

LoginStatus.displayName = 'LoginStatus';

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(LoginStatus);
