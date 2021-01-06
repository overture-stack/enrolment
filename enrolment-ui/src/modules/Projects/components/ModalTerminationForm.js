import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Modal } from 'react-bootstrap';
import { RFSelect, rules } from '../../ReduxForm';

import { toggleProjectTerminationModal } from '../redux';

const SuccessMessage = props => {
  return (
    <div className="success">
      <div className="alert alert-success">
        The Project Termination Request was sent Successfully!
      </div>
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

const ModalTerminationForm = props => {
  const {
    handleSubmit,
    pristine,
    invalid,
    toggleModal,
    projectTerminationModal: { submitSuccess, error },
    projects,
  } = props;

  const projectOptions = projects
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
          <p style={{marginTop: '1em'}}>
            A request will be sent to terminate this project. During project termination, <strong>all</strong> project resources are shut down. Please ensure that:
          </p>
          <ul>
            <li>you have paid any remaining invoices</li>
            <li>you have downloaded or saved any needed data</li>
          </ul>
          <p style={{marginBottom: '2em'}}>
            Any usage that has not yet been billed will be prepared and sent as part of project
            termination. Once complete, a confirmation will be sent to your email.
          </p>
          <div className="form-group row">
            <Field
              name="project"
              component={RFSelect}
              bootstrapClass="col-md-12"
              options={projectOptions}
              defaultOption="Select a Project"
              validate={rules.required}
            />
          </div>
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
    projectTerminationModal: state.projectTerminationModal,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggleProjectTerminationModal()),
  };
};

ModalTerminationForm.displayName = 'ModalTerminationForm';

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'projectTerminationForm',
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
  })(ModalTerminationForm),
);
