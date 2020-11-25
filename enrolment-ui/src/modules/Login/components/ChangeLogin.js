import React from 'react';
import { connect } from 'react-redux';

import { changeLoginGateway } from '../redux';

import { withTranslation } from 'react-i18next';

const ChangeLogin = props => {
  const { t, isGoogleLogin, changeLoginGateway } = props;
  const text = isGoogleLogin ? t('ChangeLogin.internal') : t('ChangeLogin.external');
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ChangeLogin));
