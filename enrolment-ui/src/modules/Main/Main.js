import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './components/Header';

import { fetchProjects } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchAllProjectUsers } from '../ProjectUsers/redux';

import './styles.scss';

class Main extends Component {
  constructor(props) {
    super(props);

    // Get initial data
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.props.fetchProjects();
    this.props.fetchApplications();
    this.props.fetchAllProjectUsers();
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <main id="main-container" className="container-fluid">{this.props.children}</main>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: () => fetchApplications(dispatch),
    fetchProjects: () => fetchProjects(dispatch),
    fetchAllProjectUsers: () => fetchAllProjectUsers(dispatch),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(Main));
