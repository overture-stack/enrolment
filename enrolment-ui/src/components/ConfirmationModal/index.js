import React, {
    useEffect,
    useState,
} from 'react';
import {
    Button,
    Modal,
} from 'react-bootstrap';

const ConfirmationModal = ({
    accept = '',
    acceptHandler = () => {},
    cancel = '',
    message = '',
    resetModal = () => {},
    show = false,
    title = '',
}) => {
    const [showModal, setShowModal] = useState(show);

    useEffect(() => {
        setShowModal(show);
    }, [show])

    const handleAccept = () => {
        setShowModal(false);
        acceptHandler();
        resetModal();
    }

    const handleClose = () => {
        setShowModal(false);
        resetModal();
    }

    return (
        <Modal
            centered
            show={showModal}
            onHide={handleClose}
            >
            <Modal.Header>
                <Modal.Title>{title || 'Are you sure?'}</Modal.Title>
            </Modal.Header>

            {message && (
                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>
            )}

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {cancel || 'Cancel'}
                </Button>
                <Button variant="primary" onClick={handleAccept}>
                    {accept || 'OK'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;
