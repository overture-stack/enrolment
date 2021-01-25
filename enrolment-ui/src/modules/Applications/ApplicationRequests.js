import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import {
    find,
    truncate,
} from 'lodash';

import ConfirmationModal from '../../components/ConfirmationModal';
import {
    approveProject,
    confirmProjectTermination,
    denyProject,
    fetchProjects,
    purgeProject,
} from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchAllProjectUsers } from '../ProjectUsers/redux';

const ApplicationRequests = ({
    applications,
    approveProject,
    confirmProjectTermination,
    denyProject,
    fetchNewData,
    profile,
    projects,
    purgeProject,
    t,
}) => {
    const [confirmPurgeID, setConfirmPurgeID] = useState(null);

    return (
        <section className="col-md-12">
            <h4>{t('ApplicationRequests.title')}</h4>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Project Title</th>
                        {profile.is_staff && (
                            <>
                                <th>Institution Name</th>
                                <th>Institution Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                            </>
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
                            return (application || profile.is_staff) && (
                                <tr key={application?.id || project?.id}>
                                    <td>
                                        {application
                                            ? (
                                                <Link to={`/view/project/${application.id}`}>
                                                    {truncate(project.project_name, { length: 10, omission: '...' })}
                                                </Link>
                                            )
                                            : truncate(project.project_name, { length: 10, omission: '...' })
                                        }
                                    </td>
                                    {profile.is_staff && (
                                        application
                                            ? (
                                                <>
                                                    <td>{application.institution_name}</td>
                                                    <td>{application.institution_email}</td>
                                                    <td>{application.firstname}</td>
                                                    <td>{application.lastname}</td>
                                                </>
                                            )
                                        : <td colspan="4">** Orphaned project **</td>
                                    )}
                                    <td className="noWrap">{project.createdDate}</td>
                                    <td className="noWrap">{project.updatedDate}</td>
                                    <td className="noWrap">{project.status}</td>

                                    {profile.is_staff && (
                                        <td className="noWrap">
                                            <div className="requests-actionsColumn">
                                                {application
                                                    ? (
                                                        project.status === 'Pending'
                                                        ? (
                                                            <>
                                                                <button
                                                                    className="linkButton"
                                                                    onClick={approveProject(
                                                                        project.id,
                                                                        fetchNewData
                                                                    )}
                                                                    >
                                                                    {t('RequestTable.action.approve')}
                                                                </button>
                                                                <button
                                                                    className="linkButton"
                                                                    onClick={denyProject(
                                                                        project.id,
                                                                        fetchNewData
                                                                    )}
                                                                    >
                                                                    {t('RequestTable.action.deny')}
                                                                </button>
                                                            </>
                                                        )
                                                    : project.status === 'Termination Requested'
                                                        ? (
                                                            <button
                                                                className="linkButton"
                                                                onClick={confirmProjectTermination(
                                                                    project.id,
                                                                    fetchNewData
                                                                )}
                                                                >
                                                                {t('RequestTable.action.confirmTermination')}
                                                            </button>
                                                        )
                                                    : [
                                                        'Denied',
                                                        'Terminated',
                                                    ].includes(project.status)
                                                        ? (
                                                            <button
                                                                className="linkButton"
                                                                onClick={() => setConfirmPurgeID(project.id)}
                                                                >
                                                                {t('RequestTable.action.purge')}
                                                            </button>
                                                        )
                                                    : <span>{t('RequestTable.action.none')}</span>
                                                    )
                                                : (
                                                    <button
                                                        className="linkButton"
                                                        onClick={() => setConfirmPurgeID(project.id)}
                                                        >
                                                        {t('RequestTable.action.purge')}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        }).filter(item => item) // remove orphan projects
                    }
                </tbody>
            </table>

            {profile.is_staff && confirmPurgeID && (
                <ConfirmationModal
                    accept="Purge it!"
                    acceptHandler={purgeProject(
                        confirmPurgeID,
                        fetchNewData
                    )}
                    message="This will remove the project and all its related data permanently."
                    resetModal={setConfirmPurgeID}
                    title="Are you sure?"
                    show={!!confirmPurgeID}
                    />
            )}
        </section>
    );
};

const mapStateToProps = state => ({
    applications: state.applications,
    profile: state.profile.data,
    projects: state.projects,
});

const mapDispatchToProps = dispatch => ({
    approveProject: (id, next) => () => approveProject(dispatch, id, next),
    confirmProjectTermination: (id, next) => () => confirmProjectTermination(dispatch, id, next),
    denyProject: (id, next) => () => denyProject(dispatch, id, next),
    fetchNewData: () => {
        fetchAllProjectUsers(dispatch);
        fetchApplications(dispatch);
        fetchProjects(dispatch);
    },
    purgeProject: (id, next) => () => purgeProject(dispatch, id, next),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ApplicationRequests));
