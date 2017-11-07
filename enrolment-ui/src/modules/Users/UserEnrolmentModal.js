import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleModal, enrollUsers } from './redux';
import ReqForm from './components/ReqForm';

const onSubmit = enroll => {
  return data => {
    // Process data for submission
    const proccessedData = data.email.emails.map(email => ({ project: data.project, email }));

    enroll(proccessedData);
  };
};

const UserEnrolmentModal = props => {
  const { userEnrolmentModal: { show }, toggleModal, enrollUsers } = props;

  return (
    <Modal show={show} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>User enrollment form</Modal.Title>
      </Modal.Header>
      <ReqForm onSubmit={onSubmit(enrollUsers)} />
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
    enrollUsers: data => enrollUsers(dispatch, data),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEnrolmentModal);
