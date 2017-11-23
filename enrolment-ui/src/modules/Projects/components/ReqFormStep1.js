import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { RFInput, rules } from '../../ReduxForm';

import { toggleBillingFields } from '../redux';

class ReqFormStep1 extends Component {
  renderBillingFields(disabled) {
    return (
      <div className="billing-fields">
        <div className="row">
          <Field
            name="billing_contact_name"
            type="text"
            placeholder="Billing Contact Name"
            component={RFInput}
            disabled={disabled}
          />
        </div>
        <div className="row">
          <Field
            type="text"
            name="billing_street_address"
            placeholder="Billing Street Address"
            component={RFInput}
            validate={rules.required}
            disabled={disabled}
          />
        </div>
        <div className="row">
          <Field
            type="text"
            name="billing_city"
            placeholder="Billing City"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
          <Field
            type="text"
            name="billing_region"
            placeholder="Billing Province / State"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
        </div>
        <div className="row">
          <Field
            type="text"
            name="billing_country"
            placeholder="Billing Country"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
          <Field
            type="text"
            name="billing_postal_code"
            placeholder="Billing Postal / Zip Code"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
      invalid,
      disabled,
      projectRequestForm: { showBillingFields },
      toggleBillingFields,
    } = this.props;

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
            type="text"
            name="street_address"
            placeholder="Street Address"
            component={RFInput}
            validate={rules.required}
            disabled={disabled}
          />
        </div>
        <div className="row">
          <Field
            type="text"
            name="city"
            placeholder="City"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
          <Field
            type="text"
            name="region"
            placeholder="Province / State"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
        </div>
        <div className="row">
          <Field
            type="text"
            name="country"
            placeholder="Country"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
          <Field
            type="text"
            name="postal_code"
            placeholder="Postal / Zip Code"
            component={RFInput}
            bootstrapClass="col-md-6"
            validate={rules.required}
            disabled={disabled}
          />
        </div>

        <div className="row billing-toggle">
          <div className="col-md-12">
            <label>Different Billing Contact?</label>
            <input type="checkbox" onChange={toggleBillingFields} checked={showBillingFields} />
          </div>
        </div>

        {showBillingFields ? this.renderBillingFields(disabled) : null}

        <div className="row">
          <Field
            type="email"
            name="daco_email"
            placeholder="Daco Email"
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
  }
}

const mapStateToProps = state => {
  return {
    projectRequestForm: state.projectRequestForm,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleBillingFields: () => dispatch(toggleBillingFields()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'projectRequestForm', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  })(ReqFormStep1),
);
