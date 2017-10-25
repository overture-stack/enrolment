import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';

import TopBar from './TopBar';
import Profile from '../../Profile';

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
              src={require('../../../assets/img/logo.svg')}
              alt="Cancer Genome COLLABORATORY"
            />
          </div>
          <div className="menu">
            <ul>
              <li>
                <NavLink to="/dashboard" activeClassName="active">
                  Dashboard
                </NavLink>
              </li>
              {projects.hasProjects &&
                (_.find(projects.projects, project => _.includes(project.status, 'Approved')) ||
                  profile.is_staff) && (
                  <li>
                    <NavLink to="/projects" activeClassName="active">
                      Projects
                    </NavLink>
                  </li>
                )}
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

export default connect(mapStateToProps, null)(Header);
