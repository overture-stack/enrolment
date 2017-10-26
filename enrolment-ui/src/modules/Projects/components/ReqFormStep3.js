import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { RFPlainInput } from '../../ReduxForm';

const ReqFormStep3 = props => {
  const { handleSubmit, previousPage } = props;
  return (
    <form onSubmit={handleSubmit} className="agreement">
      <h2 className="fs-title">Acceptance &amp; Signature</h2>
      <h3 className="fs-subtitle">Please accept the agreement to submit the form.</h3>
      <p>
        By accepting this agreement, I acknowledge and agree that my access to OICR-managed systems
        and networks is covered by, and subject to, the Terms and Conditions attached as Appendix 1
        to this form. Further, I acknowledge and accept that any violation by me of These Terms and
        Conditions may subject me to civil and/or criminal actions and that OICR remains the right,
        at is sole discretion, to terminate, cancel or suspend my accerss rights to the OICR systems
        at any time, without notice. I also acknowledge that Services provided by OICR are
        "best-effort" and therefore the OICR does not provide any sort of warranty in terms of
        availability of resources or data. I acknowledge that I will be subscribed to Collaboratory
        announcement mailing-list and will receive collaboratory notification emails.
      </p>
      <label className="form-check-label col-md-12">
        <Field
          type="checkbox"
          className="form-check-input"
          name="agreementCheck"
          component={RFPlainInput}
        />
        <span>I agree</span>
      </label>
      <button onClick={previousPage} className="previous action-button">
        Previous
      </button>
      <button type="submit" className="submit action-button">
        Submit
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'projectRequestForm', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(ReqFormStep3);
