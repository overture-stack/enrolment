import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate, Trans } from 'react-i18next';

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
    const { t, applications, profile } = this.props;

    return (
      <div className="wrapper">
        <div className="inner">
          <h1>{t('Dashboard.title')}</h1>
          <p>{t('Dashboard.intro')}</p>
          {!applications.hasApplications && !profile.is_staff ? (
            <Trans i18nKey="Dashboard.register" parent={'p'}>
              Please click here to <Link to="register/project">Register a project</Link>.
            </Trans>
          ) : null}
          {!applications.hasApplications && profile.is_staff ? (
            <p>{t('Dashboard.noRequests')}</p>
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

export default translate()(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
