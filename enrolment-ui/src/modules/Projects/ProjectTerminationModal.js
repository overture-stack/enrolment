import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import { toggleProjectTerminationModal } from './redux';
import ModalTerminationForm from './components/ModalTerminationForm';

import { fetchProjects, terminateProjectRequest, uiResetProjectsTab } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchAllProjectUsers } from '../ProjectUsers/redux';

const ProjectTerminationModal = props => {
  const {
    projectTerminationModal: { showModal },
    toggleModal,
    fetchApplications,
    fetchProjects,
    fetchAllProjectUsers,
    resetProjectsTabUi,
    terminateProjectRequest,
    location: { pathname }
  } = props;

  const onSuccess = () => {
    fetchApplications();
    fetchProjects();
    toggleModal();

    // If we're on dashboard, reload the project users as well
    if (pathname === "/dashboard") {
      fetchAllProjectUsers();
    }

    // If we're on the project tab, deselect the project
    if (pathname === "/projects") {
      resetProjectsTabUi();
    }
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
    resetProjectsTabUi: () => dispatch(uiResetProjectsTab()),
    toggleModal: () => dispatch(toggleProjectTerminationModal()),
    terminateProjectRequest: (id, next) => terminateProjectRequest(dispatch, id, next),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTerminationModal));
