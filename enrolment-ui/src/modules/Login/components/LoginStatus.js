import React from 'react';
import { connect } from 'react-redux';

import spinner from '../../../assets/img/spinner.svg';

const LoginStatus = props => {
  const { isFetching, error } = props.error;
  return (
    <div className={`login-extra-info ${isFetching || error ? 'show' : 'hide'} `}>
      {isFetching && <img src={spinner} alt="loading graphic" />}
      {error && (
        <div
          className="alert alert-danger"
          dangerouslySetInnerHTML={{ __html: error.detail || error }}
        />
      )}
    </div>
  );
};

LoginStatus.displayName = 'LoginStatus';

const mapStateToProps = state => {
  return {
    error: state.auth.error,
  };
};

export default connect(mapStateToProps, null)(LoginStatus);
