import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { RFConsent, rules } from '../../ReduxForm';

const ReqFormStep3 = props => {
  const { handleSubmit, previousPage, submitting, pristine, invalid, disabled } = props;
  return (
    <form onSubmit={handleSubmit} className="agreement">
      <div className="row">
        <div className="col-md-12">
          <h2 className="fs-title">Acceptance &amp; Signature</h2>
          <h3 className="fs-subtitle">Please accept the agreement to submit the form.</h3>
          <p>
            By accepting this agreement, I acknowledge and agree that my access to OICR-managed
            systems and networks is covered by, and subject to, the Terms and Conditions attached as
            Appendix 1 to this form. Further, I acknowledge and accept that any violation by me of
            These Terms and Conditions may subject me to civil and/or criminal actions and that OICR
            remains the right, at is sole discretion, to terminate, cancel or suspend my accerss
            rights to the OICR systems at any time, without notice. I also acknowledge that Services
            provided by OICR are "best-effort" and therefore the OICR does not provide any sort of
            warranty in terms of availability of resources or data. I acknowledge that I will be
            subscribed to Collaboratory announcement mailing-list and will receive collaboratory
            notification emails.
          </p>
        </div>
      </div>
      {disabled ? null : (
        <div className="row">
          <Field
            name="agreementCheck"
            label="I agree"
            component={RFConsent}
            validate={rules.required}
          />
        </div>
      )}
      <div className="row">
        <div className="col-md-12">
          <button onClick={previousPage} className="previous action-button">
            Previous
          </button>
          {disabled ? null : (
            <button
              type="submit"
              className="submit action-button"
              disabled={submitting || pristine || invalid}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default withRouter(
  reduxForm({
    form: 'userRequestForm', // <------ same form name
    destroyOnUnmount: false, // <------ clear form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  })(ReqFormStep3),
);
