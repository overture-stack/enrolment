import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleModal } from './redux';
import ReqForm from './components/ReqForm';

const UserEnrolmentModal = props => {
  const { userEnrolmentModal: { show }, toggleModal } = props;

  return (
    <Modal show={show} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>User enrollment form</Modal.Title>
      </Modal.Header>
      <ReqForm />
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
