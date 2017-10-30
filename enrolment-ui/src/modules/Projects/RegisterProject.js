import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ReqForm from './components/ReqForm';
import ReqSuccessModal from './components/ReqSuccessModal';

import { toggleFormModal } from './redux';

import './registerProject.scss';

const createCloseModal = (closeFunc, next) => {
  return () => {
    closeFunc();
    next();
  };
};

const RegisterProject = props => {
  const { projectRequestForm: { showModal }, toggleModal, history: { push } } = props;
  const handleClose = createCloseModal(toggleModal, () => push('/dashboard'));

  return (
    <div className="wrapper">
      <h2 style={{ textAlign: 'center' }}>Register a Project</h2>
      <div className="project-registration">
        <ReqForm />
      </div>
      <ReqSuccessModal showModal={showModal} handleClose={handleClose} />
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
  };
};

RegisterProject.displayName = 'RegisterProject';

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterProject));
