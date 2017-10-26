import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import StaffActions from './StaffActions';
import ApplicationRequests from './ApplicationRequests';
import UserRequests from './UserRequests';

const Requests = props => {
  const { profile } = props;

  // TEMP
  const state = { approved: true, showModal: false };

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
      {(state.approved || profile.is_staff) && (
        <section className="col-md-2 projects">
          <div>
            <h3>My Projects</h3>
          </div>
          <div className="projects-links">
            <Link
              to={{
                pathname: '/projects',
                hash: '#details',
              }}
            >
              View Project Details
            </Link>
            <Link
              to={{
                pathname: '/projects',
                hash: '#addUsers',
              }}
            >
              Add Users
            </Link>
            <Link
              to={{
                pathname: '/projects',
                hash: '#viewUsers',
              }}
            >
              View / Edit Users
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

Requests.displayName = 'Requests';

const mapStateToProps = state => {
  return {
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
