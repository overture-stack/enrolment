import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { toggleModal } from '../../ProjectUsers/redux';

const StaffActions = props => {
  const { t, profile, projects, toggleModal } = props;

  const hasApprovedProjects = !!_.find(projects.results, project =>
    _.includes(project.status, 'Approved'),
  );

  return (
    <div className="requests-actions">
      <Link to="register/project" className="btn btn-default">
        {t('StaffActions.register')}
      </Link>
      {hasApprovedProjects && !profile.is_staff ? (
        <Button href="#" onClick={toggleModal}>
          {t('StaffActions.enroll')}
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
    toggleModal: () => dispatch(toggleModal()),
  };
};

export default translate()(connect(mapStateToProps, mapDispatchToProps)(StaffActions));
