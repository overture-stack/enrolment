import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

import { toggleProjectTerminationModal } from '../../Projects/redux';

const StaffActions = props => {
  const { t, projects, toggleModal } = props;

  const hasApprovedProjects =
    projects.filter(project => project.status === 'Approved').length > 0;

  return (
    <div className="requests-staffActions">
      <Link to="register/project" className="btn btn-default">
        {t('StaffActions.register')}
      </Link>
      {hasApprovedProjects && (
        <Button href="#" onClick={toggleModal} variant="default">
          {t('StaffActions.terminate')}
        </Button>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    profile: state.profile.data,
    projects: state.projects.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggleProjectTerminationModal()),
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(StaffActions));
