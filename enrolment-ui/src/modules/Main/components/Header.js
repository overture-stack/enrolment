import React from 'react';
import { connect } from 'react-redux';
import {
    withRouter,
    NavLink
} from 'react-router-dom';
import {
    find,
    includes,
} from 'lodash';

import TopBar from './TopBar';
import Profile from '../../Profile';
import logoSVG from '../../../assets/img/logo.svg';

import './header.scss';

const Header = ({
    profile,
    projects
}) => (
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

                        {projects.hasProjects && (
                            find(projects.data, project => includes(project.status, 'Approved')) ||
                            profile.is_staff
                        ) && (
                            <li>
                                <NavLink exact to="/projects" activeClassName="active">
                                    Projects
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {profile.hasProfile && <Profile />}
        </div>
    </header>
);

const mapStateToProps = state => ({
    profile: state.profile,
    projects: state.projects,
});

export default withRouter(connect(mapStateToProps, null)(Header));
