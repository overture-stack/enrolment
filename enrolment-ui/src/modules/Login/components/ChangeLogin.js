import React from 'react';
import { connect } from 'react-redux';

import { changeLoginGateway } from '../redux';

const ChangeLogin = props => {
  const { isGoogleLogin, changeLoginGateway } = props;
  const text = isGoogleLogin ? 'Internal Login' : 'External Login';
  return <a onClick={changeLoginGateway}>{text}</a>;
};

ChangeLogin.displayName = 'ChangeLogin';

const mapStateToProps = state => {
  return {
    isGoogleLogin: state.login.isGoogleLogin,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeLoginGateway: () => dispatch(changeLoginGateway()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLogin);
