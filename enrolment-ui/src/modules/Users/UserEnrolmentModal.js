import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleModal } from './redux';

const UserEnrolmentModal = props => {
  const { userEnrolmentModal: { show }, toggleModal } = props;

  return (
    <Modal show={show} onHide={toggleModal}>
      <div>User Enrolment Modal!</div>
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
