import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { RFPlainInput } from '../../ReduxForm';

const ReqFormStep1 = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <h2 className="fs-title">Principal Investigator</h2>
          <h3 className="fs-subtitle">Personal information regarding your role</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field name="firstname" type="text" placeholder="First Name" component={RFPlainInput} />
        </div>
        <div className="col-md-6">
          <Field name="lastname" type="text" placeholder="Last Name" component={RFPlainInput} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Field name="position" type="text" placeholder="Position" component={RFPlainInput} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Field
            type="text"
            name="institution_name"
            placeholder="Institution Name"
            component={RFPlainInput}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Field type="text" name="address" placeholder="Address" component={RFPlainInput} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            type="email"
            name="institution_email"
            placeholder="Institution Email"
            component={RFPlainInput}
          />
        </div>
        <div className="col-md-6">
          <Field type="tel" name="phone" placeholder="Phone" component={RFPlainInput} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Field type="email" name="daco_email" placeholder="Daco Email" component={RFPlainInput} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button type="submit" className="next action-button">
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
