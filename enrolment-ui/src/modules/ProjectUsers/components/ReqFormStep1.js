import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { RFInput, rules } from '../../ReduxForm';

const ReqFormStep1 = props => {
  const { handleSubmit, invalid, disabled } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <h2 className="fs-title">Personal Information</h2>
          <h3 className="fs-subtitle">Provide your Personal &amp; Contact information</h3>
        </div>
      </div>
      <div className="row">
        <Field
          name="firstname"
          type="text"
          placeholder="First Name"
          component={RFInput}
          bootstrapClass="col-md-6"
          validate={rules.required}
          disabled={disabled}
        />
        <Field
          name="lastname"
          type="text"
          placeholder="Last Name"
          component={RFInput}
          bootstrapClass="col-md-6"
          validate={rules.required}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <Field
          name="position"
          type="text"
          placeholder="Position"
          component={RFInput}
          validate={rules.required}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <Field
          type="text"
          name="institution_name"
          placeholder="Institution Name"
          component={RFInput}
          validate={rules.required}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <Field
          type="email"
          name="institution_email"
          placeholder="Institution Email"
          component={RFInput}
          bootstrapClass="col-md-6"
          validate={[rules.required, rules.email]}
          disabled={disabled}
        />
        <Field
          type="tel"
          name="phone"
          placeholder="Phone"
          component={RFInput}
          bootstrapClass="col-md-6"
          validate={rules.required}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <Field
          type="email"
          name="daco_email"
          placeholder="Email"
          component={RFInput}
          validate={[rules.required, rules.email]}
          disabled={true}
        />
      </div>
      <div className="row">
        <div className="col-md-12">
          <button type="submit" className="next action-button" disabled={invalid}>
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'userRequestForm', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(ReqFormStep1);
