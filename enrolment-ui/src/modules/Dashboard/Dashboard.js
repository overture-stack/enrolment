import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';

import Requests from './components/Requests';
import { ProjectTerminationModal } from '../Projects';

import { fetchProjects } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchAllProjectUsers } from '../ProjectUsers/redux';

import './dashboard.scss';

const Dashboard = ({
    applications,
    fetchNewData,
    profile,
    projectUsers,
    t,
}) => {
    useEffect(() => {
        fetchNewData();
     }, []);

    return (
        <div className="wrapper">
            <div className="inner">
                <h1>{t('Dashboard.title')}</h1>
                {(applications.hasApplications || projectUsers.hasProjectUsers)
                    ? <Requests />
                    : profile.is_staff
                        ? <p>{t('Dashboard.noRequests')}</p>
                        : (
                          <Trans i18nKey="Dashboard.register" parent={'p'}>
                            Please click here to <Link to="register/project">Register a project</Link>.
                          </Trans>
                        )}
            </div>

            <ProjectTerminationModal />
        </div>
    );
}

const mapStateToProps = state => ({
    applications: state.applications,
    profile: state.profile.data,
    projectUsers: state.projectUsers,
});

const mapDispatchToProps = dispatch => ({
    fetchNewData: () => {
        fetchAllProjectUsers(dispatch);
        fetchApplications(dispatch);
        fetchProjects(dispatch);
    },
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
