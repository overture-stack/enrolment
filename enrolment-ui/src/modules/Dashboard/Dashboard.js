import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Requests from './components/Requests';
import { UserEnrolmentModal } from '../Users';

import './dashboard.scss';

const Dashboard = props => {
  const { applications, profile } = props;

  return (
    <div className="wrapper">
      <div className="inner">
        <h1>Collaboratory Enrolment</h1>
        <p>Welcome to Collaboratory online Project / User enrollment app.</p>
        {!applications.hasApplications && !profile.is_staff ? (
          <p>
            Please click here to <Link to="register/project">Register a project</Link>.
          </p>
        ) : null}
        {!applications.hasApplications && profile.is_staff ? (
          <p>There are currently no Requests for you to view.</p>
        ) : null}
        {applications.hasApplications ? <Requests /> : null}
      </div>
      <UserEnrolmentModal showModal={false} onHideModal={() => console.log('hide modal')} />
    </div>
  );
};

Dashboard.displayName = 'Dashboard';

const mapStateToProps = state => {
  return {
    applications: state.applications,
    profile: state.profile,
  };
};

export default connect(mapStateToProps, null)(Dashboard);
