import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { toggleModal, createProjectUsers } from './redux';
import ModalReqForm from './components/ModalReqForm';

const onSubmit = (createUsers, user) => {
  return data => {
    // Process data for submission
    const proccessedData = data.email.emails.map(email => ({
      project: data.project,
      daco_email: email,
      user,
    }));

    createUsers(data.project, proccessedData);
  };
};

const UserEnrolmentModal = props => {
  const { userEnrolmentModal: { show }, toggleModal, createProjectUsers, profile: { pk } } = props;

  return (
    <Modal show={show} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>User enrollment form</Modal.Title>
      </Modal.Header>
      <ModalReqForm onSubmit={onSubmit(createProjectUsers, pk)} />
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
    createProjectUsers: (projectId, data) => createProjectUsers(dispatch, projectId, data),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEnrolmentModal);
