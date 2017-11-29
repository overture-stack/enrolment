import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize } from 'redux-form';
import { translate } from 'react-i18next';

import RequestProgressBar from '../../Common/RequestProgressBar';
import ReqFormStep1 from './ReqFormStep1';
import ReqFormStep2 from './ReqFormStep2';
import ReqFormStep3 from './ReqFormStep3';

import { rfNextStep, rfPrevStep, rfResetStep, updateProjectUser } from '../redux';
import { fetchOneProject } from '../../Projects/redux';
import { fetchOneProjectUser } from '../../ProjectUsers/redux';

class ReqForm extends Component {
  static displayName = 'ReqForm';

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    // Check if

    // Load either the project or complete project user if available
    this.loadProjectAndProjectUser();

    // Init form
    this.InititiateForm();
  }

  componentWillReceiveProps(nextProps) {
    const shouldReload =
      (!this.props.project.hasFetched && nextProps.project.hasFetched) ||
      (!this.props.projectUser.hasFetched && nextProps.projectUser.hasFetched);

    if (shouldReload) {
      const data = {
        ...nextProps.project.data,
        daco_email: nextProps.profile.data.email,
        firstname: nextProps.profile.data.first_name,
        lastname: nextProps.profile.data.last_name,
        ...nextProps.projectUser.data,
      };
      this.InititiateForm(data);
    }
  }

  onSubmit(data) {
    const {
      match: { params: { projectId, userId } },
      history: { push },
      updateProjectUser,
    } = this.props;

    const d = new Date();
    const agreementDate = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

    const dateTaggedData = {
      ...data,
      agreementDate,
    };

    updateProjectUser(projectId, userId, dateTaggedData, () => push('/dashboard'));
  }

  loadProjectAndProjectUser() {
    const path = this.props.match.path;
    const projectId = this.props.match.params.projectId;
    const userId = this.props.match.params.userId;

    this.props.fetchOneProjectUser(projectId, userId);
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

  renderAlreadyRegistered() {
    const { t } = this.props;

    return (
      <div className="project">
        <div className="alert alert-danger">{t('UserRequests.invalidUserRequest')}</div>
      </div>
    );
  }

  render() {
    const { userRequestForm: { step }, formNextStep, formPrevStep, projectUser } = this.props;

    const steps = ['Personal Information', 'Collaboratory Project', 'Acceptance & Signature'];

    const path = this.props.match.path;

    const disabled = path.indexOf('view') !== -1;

    if (projectUser.data.status == 'Pending' && path.indexOf('register') !== -1)
      return this.renderAlreadyRegistered();

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
    projectUser: state.projectUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    formNextStep: () => dispatch(rfNextStep()),
    formPrevStep: () => dispatch(rfPrevStep()),
    formResetStep: () => dispatch(rfResetStep()),
    fetchOneProject: id => fetchOneProject(dispatch, id),
    fetchOneProjectUser: (projectId, useriId) => fetchOneProjectUser(dispatch, projectId, useriId),
    updateProjectUser: (projectId, id, data, next) =>
      updateProjectUser(dispatch, projectId, id, data, next),
    initializeForm: data => dispatch(initialize('userRequestForm', data)),
  };
};

export default translate()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ReqForm)));
