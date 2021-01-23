import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Trans,
    withTranslation,
} from 'react-i18next';
import {
    truncate,
} from 'lodash';

import {
    activateProjectUser,
    fetchAllProjectUsers,
    resendInviteToProjectUser,
} from './redux';

const UserRequests = ({
    activateProjectUser,
    fetchAllProjectUsers,
    profile,
    projectUsers,
    resendInviteToProjectUser,
    t,
}) => (
    <div className="col-md-12">
        <h4>{t('UserRequests.title')}</h4>
        <table className="table table-striped table-bordered">
            <thead>
                <Trans
                    i18nKey="RequestTable.userTableHeader"
                    parent="tr"
                    >
                    <th>Request ID</th>
                    <th>Name / Email</th>
                    <th>Created Date</th>
                    <th>Updated Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </Trans>
            </thead>

            <tbody>
                {!projectUsers.loading && projectUsers.data.map(user => (
                    <tr key={user.id}>
                        <td>
                            <Link
                                to={`/${
                                    user.status === 'Invited' &&
                                    profile.email === user.daco_email
                                        ? 'register/user'
                                        : 'view/project-user'
                                }/${user.project}/${user.id}/`}
                                >
                                {truncate(user.id, { length: 10, omission: '...' })}
                            </Link>
                        </td>

                        <td>
                            {user.firstname
                                ? `${user.firstname} ${user.lastname}`
                                : user.daco_email
                            }
                        </td>

                        <td className="noWrap">{user.createdDate}</td>

                        <td className="noWrap">{user.updatedDate}</td>

                        <td className="noWrap">{user.status}</td>

                        <td className="noWrap">
                            <div className="requests-actionsColumn">
                                {user.status === 'Invited'
                                    ? profile.is_staff
                                        ? (
                                            <button
                                                className="linkButton"
                                                onClick={() => resendInviteToProjectUser(
                                                    user.project,
                                                    user.id,
                                                    fetchAllProjectUsers
                                                )}
                                                >
                                                {t('RequestTable.action.resendInvite')}
                                            </button>
                                        )
                                        : (
                                            <Link
                                                to={`/register/user/${user.project}/${user.id}/`}
                                                >
                                                {t('RequestTable.action.acceptInvite')}
                                            </Link>
                                        )
                                : user.status === 'Pending'
                                    ? profile.is_staff
                                        ? (
                                            <button
                                                className="linkButton"
                                                onClick={() => activateProjectUser(
                                                    user.project,
                                                    user.id,
                                                    fetchAllProjectUsers
                                                )}
                                                >
                                                {t('RequestTable.action.approve')}
                                            </button>
                                        )
                                        : <span>{t('RequestTable.action.pending')}</span>
                                : <span>{t('RequestTable.action.none')}</span>}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const mapStateToProps = state => ({
    profile: state.profile.data,
    projectUsers: state.projectUsers,
});

const mapDispatchToProps = dispatch => ({
    activateProjectUser: (projectId, id, next) =>
    activateProjectUser(dispatch, projectId, id, next),
    fetchAllProjectUsers: () => fetchAllProjectUsers(dispatch),
    resendInviteToProjectUser: (projectId, id, next) =>
    resendInviteToProjectUser(dispatch, projectId, id, next),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(UserRequests));
