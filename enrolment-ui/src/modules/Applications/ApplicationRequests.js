import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import {
    find,
    truncate,
} from 'lodash';

import { fetchProjects, approveProject, denyProject, projectTerminated } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchAllProjectUsers } from '../ProjectUsers/redux';

const ApplicationRequests = ({
    applications,
    approveProject,
    denyProject,
    fetchNewData,
    profile,
    projects,
    projectTerminated,
    t,
}) => (
    <div className="col-md-12">
        <h4>{t('ApplicationRequests.title')}</h4>
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Project Title</th>
                    {profile.is_staff && (
                        <React.Fragment>
                            <th>Institution Name</th>
                            <th>Institution Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                        </React.Fragment>
                    )}
                    <th>Created Date</th>
                    <th>Updated Date</th>
                    <th>Status</th>
                    {profile.is_staff && <th>Action</th>}
                </tr>
            </thead>
            <tbody>
                {!(projects.loading || applications.loading) &&
                    projects.data.map(project => {
                        const application = find(applications.data, { project: project.id });

                        // ignore oprhaned projects (i.e. with no application)
                        return application && (
                            <tr key={application.id}>
                                <td>
                                    <Link to={`/view/project/${application.id}`}>
                                        {truncate(project.project_name, { length: 10, omission: '...' })}
                                    </Link>
                                </td>
                                {profile.is_staff && (
                                    <React.Fragment>
                                        <td>{application.institution_name}</td>
                                        <td>{application.institution_email}</td>
                                        <td>{application.firstname}</td>
                                        <td>{application.lastname}</td>
                                    </React.Fragment>
                                )}
                                <td className="noWrap">{project.createdDate}</td>
                                <td className="noWrap">{project.updatedDate}</td>
                                <td className="noWrap">{project.status}</td>

                                {profile.is_staff && (
                                    <td className="noWrap">
                                        <div className="requests-actionsColumn">
                                            {project.status === 'Pending'
                                                ? (
                                                    <React.Fragment>
                                                        <button
                                                            className="linkButton"
                                                            onClick={() => approveProject(project.id, fetchNewData)}
                                                            >
                                                            {t('RequestTable.action.approve')}
                                                        </button>
                                                        <button
                                                            className="linkButton"
                                                            onClick={() => denyProject(project.id, fetchNewData)}
                                                            >
                                                            {t('RequestTable.action.deny')}
                                                        </button>
                                                    </React.Fragment>
                                                )
                                            : project.status === 'Termination Requested'
                                                ? (
                                                    <button
                                                        className="linkButton"
                                                        onClick={() => projectTerminated(project.id, fetchNewData)}
                                                        >
                                                        {t('RequestTable.action.confirmTermination')}
                                                    </button>
                                                )
                                            : <span>{t('RequestTable.action.none')}</span>}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    }).filter(item => item) // remove orphan projects
                }
            </tbody>
        </table>
    </div>
);

const mapStateToProps = state => ({
    applications: state.applications,
    profile: state.profile.data,
    projects: state.projects,
});

const mapDispatchToProps = dispatch => ({
    approveProject: (id, next) => approveProject(dispatch, id, next),
    denyProject: (id, next) => denyProject(dispatch, id, next),
    fetchNewData: () => {
        fetchAllProjectUsers(dispatch);
        fetchApplications(dispatch);
        fetchProjects(dispatch);
    },
    projectTerminated: (id, next) => projectTerminated(dispatch, id, next),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ApplicationRequests));
