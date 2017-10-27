import React from 'react';
import { connect } from 'react-redux';

const ProgressBar = props => {
  const { projectRequestForm: { step } } = props;
  return (
    <ul className="progressbar">
      <li className="active">Principal Investigator</li>
      <li className={step >= 2 ? 'active' : ''}>Collaboratory Project</li>
      <li className={step === 3 ? 'active' : ''}>Acceptance &amp; Signature</li>
    </ul>
  );
};

const mapStateToProps = state => {
  return {
    projectRequestForm: state.projectRequestForm,
  };
};

ProgressBar.displayName = 'ProgressBar';

export default connect(mapStateToProps, null)(ProgressBar);
