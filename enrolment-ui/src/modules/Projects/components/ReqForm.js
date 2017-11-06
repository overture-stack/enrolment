import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import ProgressBar from './ProgressBar';
import ReqFormStep1 from './ReqFormStep1';
import ReqFormStep2 from './ReqFormStep2';
import ReqFormStep3 from './ReqFormStep3';

import { formNextStep, formPrevStep, fetchOneProject, submitProjectApplication } from '../redux';

class ReqForm extends Component {
  static displayName = 'ReqForm';

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    // Load a project if there is an id in the URL
    this.loadProjectifId();
  }

  onSubmit(data) {
    const { profile: { data: { pk } }, submitProjectApplication } = this.props;
    const submission = { ...data, user: pk };
    submitProjectApplication(submission);
  }

  loadProjectifId() {
    const { location: { search = '' }, fetchOneProject } = this.props;

    const queryVars = search.length > 0 ? queryString.parse(search) : null;
    const projectId = queryVars ? queryVars.id : null;

    if (!projectId) return false;

    fetchOneProject(projectId);
  }

  render() {
    const { projectRequestForm: { step }, formNextStep, formPrevStep } = this.props;

    return (
      <div className="project">
        <ProgressBar />
        {step === 1 ? <ReqFormStep1 onSubmit={formNextStep} /> : null}
        {step === 2 ? <ReqFormStep2 onSubmit={formNextStep} previousPage={formPrevStep} /> : null}
        {step === 3 ? <ReqFormStep3 onSubmit={this.onSubmit} previousPage={formPrevStep} /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projectRequestForm: state.projectRequestForm,
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    formNextStep: () => dispatch(formNextStep()),
    formPrevStep: () => dispatch(formPrevStep()),
    fetchOneProject: id => fetchOneProject(dispatch, id),
    submitProjectApplication: data => submitProjectApplication(dispatch, data),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReqForm));
