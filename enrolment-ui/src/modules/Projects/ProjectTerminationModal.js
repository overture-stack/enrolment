import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleProjectTerminationModal } from './redux';
import ModalTerminationForm from './components/ModalTerminationForm';

const onSubmit = data => {
  console.log(data);
};

const ProjectTerminationModal = props => {
  const {
    projectTerminationModal: { showModal },
    toggleModal,
  } = props;

  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>Project Termination</Modal.Title>
      </Modal.Header>
      <ModalTerminationForm  onSubmit={onSubmit}  />
    </Modal>
  );
};

ProjectTerminationModal.displayName = 'ProjectTerminationModal';

const mapStateToProps = state => {
  return {
    projectTerminationModal: state.projectTerminationModal,
    profile: state.profile.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggleProjectTerminationModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTerminationModal);
