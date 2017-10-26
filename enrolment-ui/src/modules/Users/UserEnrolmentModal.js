import React from 'react';
import { Modal } from 'react-bootstrap';

const UserEnrolmentModal = props => {
  const { showModal, onHideModal } = props;

  return (
    <Modal show={showModal} onHide={onHideModal}>
      <div>User Enrolment Modal!</div>
    </Modal>
  );
};

UserEnrolmentModal.displayName = 'UserEnrolmentModal';

export default UserEnrolmentModal;
