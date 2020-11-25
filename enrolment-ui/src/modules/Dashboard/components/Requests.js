import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import StaffActions from './StaffActions';
import FeesSidebarWidget from '../../Fees';
import { ApplicationRequests } from '../../Applications';
import { UserRequests } from '../../ProjectUsers';

const Requests = props => {
  const { t, profile, projects } = props;

  if (projects.loading) return false;

  const hasApprovedProjects =
    projects.data.results.filter(project => project.status === 'Approved').length > 0;

  return (
    <div className="row dashboard">
      <section className="col-md-10 requests">
        <div className="requests-header">
          <h3>{t('Requests.requestsHeader.title')}</h3>
          {!profile.is_staff ? <StaffActions /> : null}
        </div>
        <ApplicationRequests />
        <UserRequests />
      </section>
      {hasApprovedProjects || profile.is_staff ? (
        <section className="col-md-2 projects">
          <div>
            <h3>{t('Requests.projects.title')}</h3>
          </div>
          <div className="projects-links">
            <Link to={{ pathname: '/projects', hash: '#details' }}>
              {t('Requests.projects.projectDetailLink')}
            </Link>
            <Link to={{ pathname: '/projects', hash: '#addUsers' }}>
              {t('Requests.projects.addUserLink')}
            </Link>
            <Link to={{ pathname: '/projects', hash: '#viewUsers' }}>
              {t('Requests.projects.viewUserLink')}
            </Link>
          </div>
          <FeesSidebarWidget />
        </section>
      ) : null}
    </div>
  );
};

Requests.displayName = 'Requests';

const mapStateToProps = state => {
  return {
    profile: state.profile,
    projects: state.projects,
  };
};

export default withTranslation()(connect(mapStateToProps, null)(Requests));
