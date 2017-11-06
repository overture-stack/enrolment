import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { initialize, destroy } from 'redux-form';

import ProgressBar from './ProgressBar';
import ReqFormStep1 from './ReqFormStep1';
import ReqFormStep2 from './ReqFormStep2';
import ReqFormStep3 from './ReqFormStep3';

import { formNextStep, formPrevStep, formResetStep, submitProjectApplication } from '../redux';
import { fetchApplicationAndProject } from '../../Applications/redux';

class ReqForm extends Component {
  static displayName = 'ReqForm';

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    // Load application/project if there is an id in the URL
    this.loadApplicationAndProjectIfId();

    // Either load form with application/project data
    // or clear it in case of new project
    this.InititiateOrClearFormsOnId();
  }

  componentWillReceiveProps(nextProps) {
    const shouldReload = !this.props.project.hasFetched && nextProps.project.hasFetched;

    if (shouldReload) {
      const data = {
        ...nextProps.project.data,
        ...nextProps.application.data,
      };
      this.InititiateOrClearFormsOnId(data);
    }
  }

  onSubmit(data) {
    const { profile: { data: { pk } }, submitProjectApplication } = this.props;
    const submission = { ...data, user: pk };
    submitProjectApplication(submission);
  }

  checkForAndReturnId() {
    const { location: { search = '' } } = this.props;

    const queryVars = search.length > 0 ? queryString.parse(search) : null;
    const applicationId = queryVars ? queryVars.id : null;

    if (!applicationId) return false;

    return applicationId;
  }

  loadApplicationAndProjectIfId() {
    const id = this.checkForAndReturnId();
    if (id) this.props.fetchApplicationAndProject(id);
  }

  InititiateOrClearFormsOnId(newData = {}) {
    const id = this.checkForAndReturnId();

    // If id load data into form, else reset form to empty
    if (id) {
      const data = {
        ...this.props.project.data,
        ...this.props.application.data,
        ...newData,
      };

      this.props.initializeForm(data);
    } else {
      this.props.resetForm();
    }

    // Reset form pagination in all cases
    this.props.formResetStep();
  }

  render() {
    const {
      projectRequestForm: { step },
      formNextStep,
      formPrevStep,
      application,
      project,
    } = this.props;

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
    application: state.application,
    project: state.project,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    formNextStep: () => dispatch(formNextStep()),
    formPrevStep: () => dispatch(formPrevStep()),
    formResetStep: () => dispatch(formResetStep()),
    fetchApplicationAndProject: id => fetchApplicationAndProject(dispatch, id),
    submitProjectApplication: data => submitProjectApplication(dispatch, data),
    initializeForm: data => dispatch(initialize('projectRequestForm', data)),
    resetForm: () => dispatch(destroy('projectRequestForm')),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReqForm));
