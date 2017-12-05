import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ReqForm from './components/ReqForm';
import RequestSuccessModal from '../Common/RequestSuccessModal';

import { toggleFormModal, formReset } from './redux';

import './registerProject.scss';

const createCloseModal = (closeFunc, next) => {
  return () => {
    closeFunc();
    next();
  };
};

const RegisterProject = props => {
  const { projectRequestForm: { showModal }, formReset, history: { push } } = props;

  const handleClose = createCloseModal(
    () => {
      formReset();
    },
    () => push('/dashboard'),
  );

  const modalText = {
    title: 'Application',
    body:
      'Thanks! Your Application has been received. A confirmation email was sent to your DACO email. We will contact you shortly with the results of your application.',
  };

  return (
    <div className="wrapper">
      <h2 style={{ textAlign: 'center' }}>Register a Project</h2>
      <div className="project-registration">
        <ReqForm />
      </div>
      <RequestSuccessModal showModal={showModal} handleClose={handleClose} text={modalText} />
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
    toggleModal: () => dispatch(toggleFormModal()),
    formReset: () => dispatch(formReset()),
  };
};

RegisterProject.displayName = 'RegisterProject';

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterProject));
