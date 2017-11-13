import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate, Trans } from 'react-i18next';
import _ from 'lodash';

import { fetchUserRequests, approveUserRequest, denyUserRequest } from './redux';

const UserRequests = props => {
  const {
    t,
    profile,
    userRequests,
    fetchUserRequests,
    approveUserRequest,
    denyUserRequest,
  } = props;

  return (
    <div className="col-md-12">
      <h4>{t('UserRequests.title')}</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <Trans
            i18nKey={
              profile.is_staff ? 'RequestTable.tableHeaderAdmin' : 'RequestTable.tableHeader'
            }
            parent="tr"
          >
            <th>Request ID</th>
            <th>Name</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Status</th>
            {profile.is_staff ? <th>Action</th> : null}
          </Trans>
        </thead>
        <tbody>
          {userRequests.map(user => {
            return (
              <tr key={user.id}>
                <td>
                  <Link to={`/view/project-user-application/${user.project}/${user.id}/`}>
                    {_.truncate(user.id, { length: 10, omission: '...' })}
                  </Link>
                </td>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td>{user.createdDate}</td>
                <td>{user.updatedDate}</td>
                <td>{user.status}</td>
                {profile.is_staff ? (
                  <td>
                    {user.status === 'Pending' ? (
                      <div className="admin-actions">
                        <a
                          onClick={() =>
                            approveUserRequest(user.project, user.id, fetchUserRequests)}
                        >
                          {t('RequestTable.action.approve')}
                        </a>
                        <a
                          onClick={() => denyUserRequest(user.project, user.id, fetchUserRequests)}
                        >
                          {t('RequestTable.action.deny')}
                        </a>
                      </div>
                    ) : null}
                    {user.status !== 'Pending' && <span>{t('RequestTable.action.none')}</span>}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

UserRequests.displayName = 'UserRequests';

const mapStateToProps = state => {
  return {
    profile: state.profile.data,
    userRequests: state.userRequests.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUserRequests: () => fetchUserRequests(dispatch),
    approveUserRequest: (projectId, id, next) => approveUserRequest(dispatch, projectId, id, next),
    denyUserRequest: (projectId, id, next) => denyUserRequest(dispatch, projectId, id, next),
  };
};

export default translate()(connect(mapStateToProps, mapDispatchToProps)(UserRequests));
