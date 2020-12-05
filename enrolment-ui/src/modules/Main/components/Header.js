import React from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import _ from 'lodash';

import TopBar from './TopBar';
import Profile from '../../Profile';
import logoSVG from '../../../assets/img/logo.svg';

import './header.scss';

const Header = props => {
  const { profile, projects } = props;

  return (
    <header>
      <TopBar />
      <div className="bottom-bar">
        <div className="menu-container">
          <div>
            <img
              className="logo"
              src={logoSVG}
              alt="Cancer Genome COLLABORATORY"
            />
          </div>
          <div className="menu">
            <ul>
              <li>
                <NavLink exact to="/dashboard" activeClassName="active">
                  Dashboard
                </NavLink>
              </li>
              {projects.hasProjects &&
              (_.find(projects.data.results, project => _.includes(project.status, 'Approved')) ||
                profile.is_staff) ? (
                <li>
                  <NavLink exact to="/projects" activeClassName="active">
                    Projects
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        {profile.hasProfile ? <Profile /> : null}
      </div>
    </header>
  );
};

Header.displayName = 'Header';

const mapStateToProps = state => {
  return {
    profile: state.profile,
    projects: state.projects,
  };
};

export default withRouter(connect(mapStateToProps, null)(Header));
