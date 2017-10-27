import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { RFInput, rules } from '../../ReduxForm';

const ReqFormStep1 = props => {
  const { handleSubmit, pristine, invalid } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <h2 className="fs-title">Principal Investigator</h2>
          <h3 className="fs-subtitle">Personal information regarding your role</h3>
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
        />
        <Field
          name="lastname"
          type="text"
          placeholder="Last Name"
          component={RFInput}
          bootstrapClass="col-md-6"
          validate={rules.required}
        />
      </div>
      <div className="row">
        <Field
          name="position"
          type="text"
          placeholder="Position"
          component={RFInput}
          validate={rules.required}
        />
      </div>
      <div className="row">
        <Field
          type="text"
          name="institution_name"
          placeholder="Institution Name"
          component={RFInput}
          validate={rules.required}
        />
      </div>
      <div className="row">
        <Field
          type="text"
          name="address"
          placeholder="Address"
          component={RFInput}
          validate={rules.required}
        />
      </div>
      <div className="row">
        <Field
          type="email"
          name="institution_email"
          placeholder="Institution Email"
          component={RFInput}
          bootstrapClass="col-md-6"
          validate={rules.required}
        />
        <Field
          type="tel"
          name="phone"
          placeholder="Phone"
          component={RFInput}
          bootstrapClass="col-md-6"
          validate={rules.required}
        />
      </div>
      <div className="row">
        <Field
          type="email"
          name="daco_email"
          placeholder="Daco Email"
          component={RFInput}
          validate={rules.required}
        />
      </div>
      <div className="row">
        <div className="col-md-12">
          <button type="submit" className="next action-button" disabled={pristine || invalid}>
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'projectRequestForm', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(ReqFormStep1);
