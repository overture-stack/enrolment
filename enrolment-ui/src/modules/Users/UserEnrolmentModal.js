import React from 'react';
import { Modal } from 'react-bootstrap';

const UserEnrolmentModal = props => {
  const { showModal, handleClose } = props;

  return (
    <Modal show={showModal} onHide={handleClose}>
      <div>User Enrolment Modal!</div>
    </Modal>
  );
};

UserEnrolmentModal.displayName = 'UserEnrolmentModal';

export default UserEnrolmentModal;
