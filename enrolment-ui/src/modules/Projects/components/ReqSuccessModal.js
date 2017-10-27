import React from 'react';
import { Modal } from 'react-bootstrap';

const ReqSuccessModal = props => {
  const { showModal, handleClose } = props;

  return (
    <Modal show={showModal} onHide={handleClose} closeButton>
      <Modal.Header>
        <Modal.Title>Application</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Thanks! Your Application has been received. A confirmation email was sent to your provided
        email. We will contact you shortly with the results of your application.
      </Modal.Body>
      <Modal.Footer>
        <button className="action-button" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

ReqSuccessModal.displayName = 'ReqSuccessModal';

export default ReqSuccessModal;
