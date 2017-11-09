import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize } from 'redux-form';

import RequestProgressBar from '../../Common/RequestProgressBar';
import ReqFormStep1 from './ReqFormStep1';
import ReqFormStep2 from './ReqFormStep2';
import ReqFormStep3 from './ReqFormStep3';

import { rfNextStep, rfPrevStep, rfResetStep, submitUserApplication } from '../redux';
import { fetchOneProject } from '../../Projects/redux';

class ReqForm extends Component {
  static displayName = 'ReqForm';

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    // Load either the project or complete project user if available
    this.loadProjectOrProjectUser();

    // Init form
    this.InititiateForm();
  }

  componentWillReceiveProps(nextProps) {
    const shouldReload = !this.props.project.hasFetched && nextProps.project.hasFetched;

    if (shouldReload) {
      const data = {
        ...nextProps.project.data,
        daco_email: nextProps.profile.data.email,
        firstname: nextProps.profile.data.first_name,
        lastname: nextProps.profile.data.last_name,
      };
      this.InititiateForm(data);
    }
  }

  onSubmit(data) {
    const {
      match: { params: { projectId } },
      history: { push },
      submitUserApplication,
    } = this.props;
    submitUserApplication(projectId, data, () => push('/dashboard'));
  }

  loadProjectOrProjectUser() {
    const projectId = this.props.match.params.projectId; // or project user id
    this.props.fetchOneProject(projectId);
  }

  InititiateForm(newData = false) {
    const data =
      newData !== false
        ? newData
        : {
            ...this.props.project.data,
            daco_email: this.props.profile.data.email,
            firstname: this.props.profile.data.first_name,
            lastname: this.props.profile.data.last_name,
          };

    this.props.initializeForm(data);

    // Reset form pagination in all cases
    this.props.formResetStep();
  }

  render() {
    const { userRequestForm: { step }, formNextStep, formPrevStep } = this.props;

    const steps = ['Personal Information', 'Collaboratory Project', 'Acceptance & Signature'];

    const disabled = false; // this.checkForAndReturnId() !== false;

    return (
      <div className="project">
        <RequestProgressBar steps={steps} active={step} />
        {step === 1 ? <ReqFormStep1 onSubmit={formNextStep} disabled={disabled} /> : null}
        {step === 2 ? <ReqFormStep2 onSubmit={formNextStep} previousPage={formPrevStep} /> : null}
        {step === 3 ? (
          <ReqFormStep3 onSubmit={this.onSubmit} disabled={disabled} previousPage={formPrevStep} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userRequestForm: state.userRequestForm,
    profile: state.profile,
    project: state.project,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    formNextStep: () => dispatch(rfNextStep()),
    formPrevStep: () => dispatch(rfPrevStep()),
    formResetStep: () => dispatch(rfResetStep()),
    fetchOneProject: id => fetchOneProject(dispatch, id),
    submitUserApplication: (projectId, data, next) =>
      submitUserApplication(dispatch, projectId, data, next),
    initializeForm: data => dispatch(initialize('userRequestForm', data)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReqForm));
