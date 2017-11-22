import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize } from 'redux-form';

import RequestProgressBar from '../../Common/RequestProgressBar';
import ReqFormStep1 from './ReqFormStep1';
import ReqFormStep2 from './ReqFormStep2';
import ReqFormStep3 from './ReqFormStep3';

import {
  formNextStep,
  formPrevStep,
  formReset,
  showBillingFields,
  submitProjectApplication,
} from '../redux';
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
      const applicationData = nextProps.application.data.billing_contact
        ? {
            ...nextProps.application.data,
            ...this.extractBillingData(nextProps.application.data.billing_contact),
          }
        : nextProps.application.data;

      const data = {
        ...nextProps.project.data,
        ...applicationData,
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
    const { match: { params: { id = '' } } } = this.props;

    const applicationId = id.length > 0 ? id : null;

    if (!applicationId) return false;

    return applicationId;
  }

  loadApplicationAndProjectIfId() {
    const id = this.checkForAndReturnId();
    if (id) this.props.fetchApplicationAndProject(id);
  }

  InititiateOrClearFormsOnId(newData = {}) {
    const id = this.checkForAndReturnId();

    // If id load data into form, else reset form to empty (but include daco email)
    if (id) {
      const applicationData =
        this.props.application.data && this.props.application.data.billing_contact
          ? {
              ...this.props.application.data,
              ...this.extractBillingData(this.props.application.data.billing_contact),
            }
          : this.props.application.data;

      const data = {
        ...this.props.project.data,
        ...applicationData,
        ...newData,
      };

      this.props.initializeForm(data);
    } else {
      const data = {
        daco_email: this.props.profile.data.email,
      };
      this.props.initializeForm(data);
    }

    // Reset form pagination in all cases
    this.props.formReset();

    // If the form has billing data show it
    if (this.props.application.data && this.props.application.data.billing_contact)
      this.props.showBillingFields();
  }

  extractBillingData(data) {
    return Object.keys(data).reduce((res, key) => {
      res[`billing_${key}`] = data[key];
      return res;
    }, {});
  }

  render() {
    const { projectRequestForm: { step }, formNextStep, formPrevStep } = this.props;

    const steps = ['Principal Investigator', 'Collaboratory Project', 'Acceptance & Signature'];

    const disabled = this.checkForAndReturnId() !== false;

    return (
      <div className="project">
        <RequestProgressBar steps={steps} active={step} />
        {step === 1 ? <ReqFormStep1 onSubmit={formNextStep} disabled={disabled} /> : null}
        {step === 2 ? (
          <ReqFormStep2 onSubmit={formNextStep} disabled={disabled} previousPage={formPrevStep} />
        ) : null}
        {step === 3 ? (
          <ReqFormStep3 onSubmit={this.onSubmit} disabled={disabled} previousPage={formPrevStep} />
        ) : null}
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
    formReset: () => dispatch(formReset()),
    showBillingFields: () => dispatch(showBillingFields()),
    fetchApplicationAndProject: id => fetchApplicationAndProject(dispatch, id),
    submitProjectApplication: data => submitProjectApplication(dispatch, data),
    initializeForm: data => dispatch(initialize('projectRequestForm', data)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReqForm));
