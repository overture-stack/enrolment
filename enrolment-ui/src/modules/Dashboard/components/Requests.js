import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import StaffActions from './StaffActions';
import FeesSidebarWidget from '../../Fees';
import { ApplicationRequests } from '../../Applications';
import { UserRequests } from '../../ProjectUsers';

const Requests = ({
    profile,
    projects,
    projectUsers,
    t,
}) => {
    const ownsProjects = projects.data.length > 0;
    const isMember = projectUsers.data.length > 0;
    const ownsApprovedProjects = ownsProjects &&
        projects.data.filter(project => project.status === 'Approved').length > 0;

    return !projects.loading && (
        <div className="row dashboard">
            <section className="col-md-10 requests">
                <div className="requests-header">
                    <h3>{t('Requests.requestsHeader.title')}</h3>

                    {!profile.is_staff && <StaffActions />}
                </div>

                {ownsProjects && <ApplicationRequests />}

                {isMember && <UserRequests />}
            </section>

            {(ownsProjects || profile.is_staff) && (
                <section className="col-md-2 projects">
                    {ownsApprovedProjects && (
                        <React.Fragment>
                            <h3>{t('Requests.projects.title')}</h3>

                            <div className="projects-links">
                                <Link to={{ pathname: '/projects', hash: '#details' }}>
                                    {t('Requests.projects.projectDetailLink')}
                                </Link>

                                <Link to={{ pathname: '/projects', hash: '#addUsers' }}>
                                    {t('Requests.projects.addUserLink')}
                                </Link>

                                <Link to={{ pathname: '/projects', hash: '#viewUsers' }}>
                                    {t('Requests.projects.viewUserLink')}
                                </Link>
                            </div>
                        </React.Fragment>
                    )}

                    <FeesSidebarWidget />
                </section>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    profile: state.profile.data,
    projects: state.projects,
    projectUsers: state.projectUsers,
});

export default withTranslation()(connect(mapStateToProps, null)(Requests));
