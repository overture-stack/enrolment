import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { RFPlainInput } from '../../ReduxForm';

import { adminLogin } from '../../Auth/redux';

import ChangeLogin from './ChangeLogin';

const LoginForm = props => {
  const { handleSubmit, pristine, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field type="text" placeholder="Username" name="username" component={RFPlainInput} />
      <Field type="email" placeholder="Email" name="email" component={RFPlainInput} />
      <Field type="password" placeholder="Password" name="password" component={RFPlainInput} />
      <button type="submit" className="submit action-button" disabled={submitting || pristine}>
        Submit
      </button>
    </form>
  );
};

const AdminLoginForm = reduxForm({ form: 'adminLoginForm' })(LoginForm);

const InternalLoginForm = props => {
  const { adminLogin } = props;

  return (
    <div className="login-container">
      <div className="login-container">
        <AdminLoginForm onSubmit={adminLogin} />
      </div>
      <ChangeLogin />
    </div>
  );
};

InternalLoginForm.displayName = 'InternalLoginForm';

const mapDispatchToProps = dispatch => {
  return {
    adminLogin: data => adminLogin(dispatch, data),
  };
};

export default connect(null, mapDispatchToProps)(InternalLoginForm);
