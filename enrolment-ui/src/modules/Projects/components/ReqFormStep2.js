import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { RFInput, RFTextArea, RFConsent, rules } from '../../ReduxForm';

const ReqFormStep2 = props => {
  const { handleSubmit, previousPage, invalid, disabled } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <h2 className="fs-title">Collaboratory Project</h2>
          <h3 className="fs-subtitle">
            Please provide a title and brief description of the research project you are requesting
            Collaboratory’s compute resources and data access for. Maximum 250 words.
          </h3>
        </div>
      </div>
      <div className="row">
        <Field
          type="text"
          name="project_name"
          placeholder="Project Name"
          component={RFInput}
          validate={rules.required}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <Field
          type="checkbox"
          name="project_ICGC_access"
          label="I have or intend to acquire DACO access"
          className="text-left"
          component={RFConsent}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <Field
          name="project_description"
          placeholder="Project Purpose"
          component={RFTextArea}
          validate={[rules.required, rules.maxLength(250)]}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <div className="col-md-12">
          <button onClick={previousPage} className="previous action-button">
            Previous
          </button>
          <button type="submit" className="next action-button" disabled={invalid}>
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
})(ReqFormStep2);
