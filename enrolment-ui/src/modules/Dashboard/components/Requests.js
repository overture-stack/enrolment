import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import StaffActions from './StaffActions';
import { ApplicationRequests } from '../../Applications';
import { UserRequests } from '../../Users';

const Requests = props => {
  const { profile, projects } = props;

  const hasApprovedProjects = !!_.find(projects.results, project =>
    _.includes(project.status, 'Approved'),
  );

  return (
    <div className="row dashboard">
      <section className="col-md-10 requests">
        <div className="requests-header">
          <h3>My Requests</h3>
          {!profile.is_staff ? <StaffActions /> : null}
        </div>
        <ApplicationRequests />
        <UserRequests />
      </section>
      {hasApprovedProjects || profile.is_staff ? (
        <section className="col-md-2 projects">
          <div>
            <h3>My Projects</h3>
          </div>
          <div className="projects-links">
            <Link to={{ pathname: '/projects', hash: '#details' }}>View Project Details</Link>
            <Link to={{ pathname: '/projects', hash: '#addUsers' }}>Add Users</Link>
            <Link to={{ pathname: '/projects', hash: '#viewUsers' }}>View / Edit Users</Link>
          </div>
        </section>
      ) : null}
    </div>
  );
};

Requests.displayName = 'Requests';

const mapStateToProps = state => {
  return {
    profile: state.profile.data,
    projects: state.projects.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
