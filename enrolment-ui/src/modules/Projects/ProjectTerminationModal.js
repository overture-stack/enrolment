import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleProjectTerminationModal } from './redux';
import ModalTerminationForm from './components/ModalTerminationForm';

import { fetchProjects, terminateProjectRequest } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchAllProjectUsers } from '../ProjectUsers/redux';

const ProjectTerminationModal = props => {
  const {
    projectTerminationModal: { showModal },
    toggleModal,
    fetchApplications,
    fetchProjects,
    fetchAllProjectUsers,
    terminateProjectRequest,
  } = props;

  const onSuccess = () => {
    fetchApplications();
    fetchProjects();
    fetchAllProjectUsers();
    toggleModal();
  };

  const onSubmit = data => {
    terminateProjectRequest(data.project, onSuccess);
  };

  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>Project Termination</Modal.Title>
      </Modal.Header>
      <ModalTerminationForm onSubmit={onSubmit} />
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
    fetchApplications: () => fetchApplications(dispatch),
    fetchProjects: () => fetchProjects(dispatch),
    fetchAllProjectUsers: () => fetchAllProjectUsers(dispatch),
    toggleModal: () => dispatch(toggleProjectTerminationModal()),
    terminateProjectRequest: (id, next) => terminateProjectRequest(dispatch, id, next),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTerminationModal);
