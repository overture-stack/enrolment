import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleModal, createProjectUsers, fetchAllProjectUsers } from './redux';
import ModalReqForm from './components/ModalReqForm';

const onSubmit = (createUsers, user, next) => {
  return data => {
    // Process data for submission
    const proccessedData = data.email.emails.map(email => ({
      project: data.project,
      daco_email: email,
      user,
    }));

    createUsers(data.project, proccessedData, next);
  };
};

const UserEnrolmentModal = props => {
  const {
    userEnrolmentModal: { show },
    toggleModal,
    createProjectUsers,
    profile: { pk },
    fetchAllProjectUsers,
  } = props;

  return (
    <Modal
        centered
        show={show}
        onHide={toggleModal}
        >
      <Modal.Header>
        <Modal.Title>Enrol Users</Modal.Title>
      </Modal.Header>
      <ModalReqForm onSubmit={onSubmit(createProjectUsers, pk, fetchAllProjectUsers)} />
    </Modal>
  );
};

UserEnrolmentModal.displayName = 'UserEnrolmentModal';

const mapStateToProps = state => {
  return {
    userEnrolmentModal: state.userEnrolmentModal,
    profile: state.profile.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggleModal()),
    createProjectUsers: (projectId, data, next) =>
      createProjectUsers(dispatch, projectId, data, next),
    fetchAllProjectUsers: () => fetchAllProjectUsers(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEnrolmentModal);
