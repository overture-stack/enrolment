import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Modal } from 'react-bootstrap';
import { RFSelect, rules } from '../../ReduxForm';
import EmailList from './EmailList';

import { toggleModal } from '../redux';

const SuccessMessage = props => {
  return (
    <div className="success">
      <div className="alert alert-success">The Enrolment Request was sent Successfully!</div>
    </div>
  );
};

const ErrorMessage = props => {
  const { error } = props;
  return (
    <div className="error">
      <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />
    </div>
  );
};

const ModalReqForm = props => {
  const {
    handleSubmit,
    pristine,
    invalid,
    toggleModal,
    userEnrolmentForm: { submitSuccess, error },
    projects,
  } = props;

  const projectOptions = projects.results
    .filter(project => project.status === 'Approved')
    .map(project => {
      return {
        text: project.project_name,
        value: project.id,
      };
    });

  const closeModal = event => {
    event.preventDefault();
    toggleModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitSuccess ? (
        <Modal.Body>
          <SuccessMessage />
        </Modal.Body>
      ) : (
        <Modal.Body>
          <div className="form-group row">
            <div className="col-md-4">
              <label htmlFor="projectSelector">Project</label>
            </div>
            <Field
              name="project"
              component={RFSelect}
              bootstrapClass="col-md-6"
              options={projectOptions}
              defaultOption="Select a Project"
              validate={rules.required}
            />
          </div>
          {pristine ? null : (
            <Field
              component={EmailList}
              label="Users' Email"
              name="email"
              validate={rules.required}
            />
          )}
          {error ? <ErrorMessage error={error} /> : null}
        </Modal.Body>
      )}
      <Modal.Footer>
        <button className="action-button" onClick={closeModal}>
          Close
        </button>
        {!submitSuccess ? (
          <button type="submit" className="action-button" disabled={pristine || invalid}>
            Submit
          </button>
        ) : null}
      </Modal.Footer>
    </form>
  );
};

const mapStateToProps = state => {
  return {
    projects: state.projects.data,
    userEnrolmentForm: state.userEnrolmentForm,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggleModal()),
  };
};

ModalReqForm.displayName = 'ModalReqForm';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  reduxForm({
    form: 'userRequestForm',
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
  })(ModalReqForm),
);
