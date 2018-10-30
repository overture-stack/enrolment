import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { RFInput, RFSelectFlat, rules } from '../../ReduxForm';

import { toggleBillingFields, changeCountry, changeBillingCountry } from '../redux';

class ReqFormStep1 extends Component {
  renderBillingFields(disabled, countryRegion, changeBillingCountry, selectedBillingRegion) {
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
            name="billing_country"
            defaultOption="Billing Country"
            component={RFSelectFlat}
            options={countryRegion.countries}
            bootstrapClass="col-md-6"
            onChange={event => changeBillingCountry(event.target.value)}
            validate={rules.required}
            disabled={disabled}
          />
          <Field
            name="billing_region"
            defaultOption={disabled ? selectedBillingRegion : 'Billing Province / State'}
            component={RFSelectFlat}
            options={countryRegion.billingRegionOptions}
            bootstrapClass="col-md-6"
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
      projectRequestForm: { showBillingFields, countryRegion },
      toggleBillingFields,
      changeCountry,
      changeBillingCountry,
      selectedRegion,
      selectedBillingRegion,
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
            name="institution_website"
            placeholder="Institution Website"
            component={RFInput}
            validate={rules.url}
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
            name="country"
            defaultOption="Country"
            component={RFSelectFlat}
            options={countryRegion.countries}
            bootstrapClass="col-md-6"
            onChange={event => changeCountry(event.target.value)}
            validate={rules.required}
            disabled={disabled}
          />
          <Field
            name="region"
            defaultOption={disabled ? selectedRegion : 'Province / State'}
            component={RFSelectFlat}
            options={countryRegion.regionOptions}
            bootstrapClass="col-md-6"
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

        {showBillingFields
          ? this.renderBillingFields(
              disabled,
              countryRegion,
              changeBillingCountry,
              selectedBillingRegion,
            )
          : null}

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

const selector = formValueSelector('projectRequestForm');
const mapStateToProps = state => {
  return {
    projectRequestForm: state.projectRequestForm,
    selectedRegion: selector(state, 'region'),
    selectedBillingRegion: selector(state, 'billing_region'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeCountry: country => {
      // Reset region on country change
      dispatch(change('projectRequestForm', 'region', ''));
      dispatch(changeCountry(country));
    },
    changeBillingCountry: country => {
      // Reset region on country change
      dispatch(change('projectRequestForm', 'billing_region', ''));
      dispatch(changeBillingCountry(country));
    },
    toggleBillingFields: () => dispatch(toggleBillingFields()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  reduxForm({
    form: 'projectRequestForm', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  })(ReqFormStep1),
);
