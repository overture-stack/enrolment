import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './components/Header';

import { fetchProjects } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchUserRequests } from '../Users/redux';

class Main extends Component {
  static displayName = 'Main';

  constructor(props) {
    super(props);

    // Get initial data
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.props.fetchProjects();
    this.props.fetchApplications();
    this.props.fetchUserRequests();
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">{this.props.children}</div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: () => fetchApplications(dispatch),
    fetchProjects: () => fetchProjects(dispatch),
    fetchUserRequests: () => fetchUserRequests(dispatch),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(Main));
