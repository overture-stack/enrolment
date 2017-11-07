import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Requests from './components/Requests';
import { UserEnrolmentModal } from '../Users';

import { fetchProjects } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchUserRequests } from '../Users/redux';

import './dashboard.scss';

class Dashboard extends Component {
  static displayName = 'Dashboard';

  constructor(props) {
    super(props);

    // Get initial data
    this.fetchNewData = this.fetchNewData.bind(this);
    this.fetchNewData();
  }

  fetchNewData() {
    this.props.fetchProjects();
    this.props.fetchApplications();
    this.props.fetchUserRequests();
  }

  render() {
    const { applications, profile } = this.props;

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
        <UserEnrolmentModal />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    applications: state.applications,
    profile: state.profile.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: () => fetchApplications(dispatch),
    fetchProjects: () => fetchProjects(dispatch),
    fetchUserRequests: () => fetchUserRequests(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
