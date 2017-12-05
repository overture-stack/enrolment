import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { rules } from '../../ReduxForm';
import EmailList from './EmailList';

const SuccessMessage = props => {
  return (
    <div className="success">
      <div className="alert alert-success">The Enrolment Request was send Successfully!</div>
    </div>
  );
};

const ErrorMessage = props => {
  const { error } = props;
  return (
    <div className="error">
      <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />
    </div>
  );
};

const TabReqForm = props => {
  const { handleSubmit, pristine, invalid, userEnrolmentForm: { submitSuccess, error } } = props;

  return (
    <form onSubmit={handleSubmit}>
      {submitSuccess ? (
        <SuccessMessage />
      ) : (
        <Field
          component={EmailList}
          label="Users' Daco Email"
          name="email"
          validate={rules.required}
        />
      )}
      {error ? <ErrorMessage error={error} /> : null}
      {!submitSuccess ? (
        <button type="submit" className="action-button" disabled={pristine || invalid}>
          Submit
        </button>
      ) : null}
    </form>
  );
};

const mapStateToProps = state => {
  return {
    userEnrolmentForm: state.userEnrolmentForm,
  };
};

TabReqForm.displayName = 'TabReqForm';

export default connect(mapStateToProps, null)(
  reduxForm({
    form: 'userRequestForm',
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
  })(TabReqForm),
);
