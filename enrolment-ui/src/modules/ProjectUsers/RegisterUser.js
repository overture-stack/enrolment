import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ReqForm from './components/ReqForm';
import RequestSuccessModal from '../Common/RequestSuccessModal';

import { rfResetStep, rfToggleModal } from './redux';

import './registerUser.scss';

const createCloseModal = (closeFunc, next) => {
  return () => {
    closeFunc();
    next();
  };
};

const RegisterUser = props => {
  const { userRequestForm: { showModal }, toggleModal, formResetStep, history: { push } } = props;

  const handleClose = createCloseModal(
    () => {
      toggleModal();
      formResetStep();
    },
    () => push('/dashboard'),
  );

  const modalText = {
    title: 'User Enrolment Request',
    body:
      'Thanks! Your application has been received. A notification has been sent to your PI updating them as well as our IT department alerting them to activate your user account.',
  };

  return (
    <div className="wrapper">
      <h2 style={{ textAlign: 'center' }}>Register a User</h2>
      <div className="project-registration">
        <ReqForm />
      </div>
      <RequestSuccessModal showModal={showModal} handleClose={handleClose} text={modalText} />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userRequestForm: state.projectRequestForm,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(rfToggleModal()),
    formResetStep: () => dispatch(rfResetStep()),
  };
};

RegisterUser.displayName = 'RegisterUser';

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterUser));
