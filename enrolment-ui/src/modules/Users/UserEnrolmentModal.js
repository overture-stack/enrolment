import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleModal } from './redux';
import ReqForm from './components/ReqForm';

const onSubmit = data => {
  // Process data for submission
  const proccessedData = data.email.emails.map(email => ({ project: data.project, email }));

  console.log(proccessedData);
};

const UserEnrolmentModal = props => {
  const { userEnrolmentModal: { show }, toggleModal } = props;

  return (
    <Modal show={show} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>User enrollment form</Modal.Title>
      </Modal.Header>
      <ReqForm onSubmit={onSubmit} />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEnrolmentModal);
