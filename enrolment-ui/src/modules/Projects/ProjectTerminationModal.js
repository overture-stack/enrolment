import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleProjectTerminationModal } from './redux';

const onSubmit = () => {
  return data => {};
};

const ProjectTerminationModal = props => {
  const {
    projectTerminationModal: { showModal },
    toggleModal,
    profile: { pk },
  } = props;

  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>Project Termination</Modal.Title>
      </Modal.Header>
      Terminate the Project
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
