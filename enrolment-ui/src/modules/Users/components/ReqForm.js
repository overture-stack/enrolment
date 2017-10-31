import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Modal } from 'react-bootstrap';
import { RFInput, rules } from '../../ReduxForm';

import { toggleModal } from '../redux';

const successMessage = props => {
  return (
    <div className="success">
      <div className="alert alert-success">The Enrolment Request was send Successfully!</div>
    </div>
  );
};

const errorMessage = props => {
  const { message } = props;
  return (
    <div className="error">
      {this.state.error && (
        <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </div>
  );
};

const ReqForm = props => {
  const {
    handleSubmit,
    pristine,
    invalid,
    toggleModal,
    userEnrolmentModal: { submitSuccess, error },
    projects,
    profile,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Modal.Body>
        {submitSuccess ? <successMessage /> : null}
        <div className="form-group row">
          <div className="col-md-4">
            <label htmlFor="projectSelector">Project</label>
          </div>
          <div className="col-md-6">
            <select className="form-control" id="projectSelector" name="project">
              <option selected={true}>Select a Project</option>
              {projects.filter(project => project.status === 'Approved').map(project => (
                <option value={project.id} key={project.id}>
                  {project.project_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-4">
            <label htmlFor="projectSelector">Users' Daco Email</label>
          </div>
          <div className="col-md-6 user-email">
            <input className="form-control" name="email" type="email" placeholder={profile.email} />
          </div>
          <div className="col-md-2">
            <button
              className="action-button small"
              onClick={() => console.log('Add email')}
              disabled={false}
            >
              Add
            </button>
          </div>
        </div>
        {error ? <errorMessage message={error} /> : null}
      </Modal.Body>
      <Modal.Footer>
        <button className="action-button" onClick={toggleModal}>
          Close
        </button>
        <button className="action-button" onClick={() => console.log('submit')} disabled={false}>
          Submit
        </button>
      </Modal.Footer>
    </form>
  );
};

const mapStateToProps = state => {
  return {
    profile: state.profile.data,
    projects: state.projects.data,
    userEnrolmentModal: state.userEnrolmentModal,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggleModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'userRequestForm',
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
  })(ReqForm),
);
