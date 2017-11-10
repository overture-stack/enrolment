import React from 'react';
import { connect } from 'react-redux';

import { changeLoginGateway } from '../redux';

import { I18n } from 'react-i18next';

const ChangeLogin = props => {
  const { isGoogleLogin, changeLoginGateway } = props;
  return (
    <I18n ns="translations">
      {(t, { i18n }) => (
        <a onClick={changeLoginGateway}>
          {isGoogleLogin ? t('ChangeLogin.internal') : t('ChangeLogin.external')}
        </a>
      )}
    </I18n>
  );
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
