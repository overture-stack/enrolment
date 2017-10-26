import React from 'react';
import { connect } from 'react-redux';

import ProgressBar from './ProgressBar';
import ReqFormStep1 from './ReqFormStep1';
import ReqFormStep2 from './ReqFormStep2';
import ReqFormStep3 from './ReqFormStep3';

import { formNextStep, formPrevStep, submitProjectApplication } from '../redux';

const ReqForm = props => {
  const {
    projectRequestForm: { step },
    formNextStep,
    formPrevStep,
    submitProjectApplication,
  } = props;
  return (
    <div className="project">
      <ProgressBar />
      {step === 1 ? <ReqFormStep1 onSubmit={formNextStep} /> : null}
      {step === 2 ? <ReqFormStep2 onSubmit={formNextStep} previousPage={formPrevStep} /> : null}
      {step === 3 ? (
        <ReqFormStep3 onSubmit={submitProjectApplication} previousPage={formPrevStep} />
      ) : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    projectRequestForm: state.projectRequestForm,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    formNextStep: () => dispatch(formNextStep()),
    formPrevStep: () => dispatch(formPrevStep()),
    submitProjectApplication: data => submitProjectApplication(dispatch, data),
  };
};

ReqForm.displayName = 'ReqForm';

export default connect(mapStateToProps, mapDispatchToProps)(ReqForm);
