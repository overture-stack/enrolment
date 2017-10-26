import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { RFPlainInput } from '../../ReduxForm';

const ReqFormStep2 = props => {
  const { handleSubmit, previousPage } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <h2 className="fs-title">Collaboratory Project</h2>
          <h3 className="fs-subtitle">
            Please provide a name and short description of the research project you are requesting
            Collaboratory’s compute resources for.
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Field
            type="text"
            name="project_name"
            placeholder="Project Name"
            component={RFPlainInput}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <textarea name="project_description" placeholder="Project Description" />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button onClick={previousPage} className="previous action-button">
            Previous
          </button>
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
})(ReqFormStep2);
