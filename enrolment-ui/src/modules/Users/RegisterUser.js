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
    title: 'User Enrollment Request',
    body:
      'Thanks! Your Application has been received. A confirmation email was sent to your provided email. We will contact you shortly with the results of your application.',
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
