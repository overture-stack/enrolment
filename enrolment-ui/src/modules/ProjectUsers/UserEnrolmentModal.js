import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleModal, createProjectUsers } from './redux';
import ModalReqForm from './components/ModalReqForm';

const onSubmit = enroll => {
  return data => {
    // Process data for submission
    const proccessedData = data.email.emails.map(email => ({ project: data.project, email }));

    enroll(proccessedData);
  };
};

const UserEnrolmentModal = props => {
  const { userEnrolmentModal: { show }, toggleModal, createProjectUsers } = props;

  return (
    <Modal show={show} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>User enrollment form</Modal.Title>
      </Modal.Header>
      <ModalReqForm onSubmit={onSubmit(createProjectUsers)} />
    </Modal>
  );
};

UserEnrolmentModal.displayName = 'UserEnrolmentModal';

const mapStateToProps = state => {
  return {
    userEnrolmentModal: state.userEnrolmentModal,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggleModal()),
    createProjectUsers: data => createProjectUsers(dispatch, data),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEnrolmentModal);
