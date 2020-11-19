import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { translate } from 'react-i18next';

import { toggleProjectTerminationModal } from '../../Projects/redux';

const StaffActions = props => {
  const { t, projects, toggleModal } = props;

  const hasApprovedProjects =
    projects.filter(project => project.status === 'Approved').length > 0;

  return (
    <div className="requests-actions">
      <Link to="register/project" className="btn btn-default">
        {t('StaffActions.register')}
      </Link>
      {hasApprovedProjects ? (
        <Button href="#" onClick={toggleModal}>
          {t('StaffActions.terminate')}
        </Button>
      ) : null}
    </div>
  );
};

StaffActions.displayName = 'StaffActions';

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

export default translate()(connect(mapStateToProps, mapDispatchToProps)(StaffActions));
