import React from 'react';
import { Modal } from 'react-bootstrap';

const RequestSuccessModal = props => {
  const { showModal, handleClose, text: { title, body } } = props;

  return (
    <Modal
        centered
        show={showModal}
        onHide={handleClose}
        >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <button className="action-button" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

RequestSuccessModal.displayName = 'RequestSuccessModal';

export default RequestSuccessModal;
