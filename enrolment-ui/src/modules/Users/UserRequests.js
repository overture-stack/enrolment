import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { fetchUserRequests, approveUserRequest, denyUserRequest } from './redux';

const UserRequests = props => {
  const { profile, userRequests, fetchUserRequests, approveUserRequest, denyUserRequest } = props;

  return (
    <div className="col-md-12">
      <h4>User Requests</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Name</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Status</th>
            {profile.is_staff ? <th>Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {userRequests.map(user => {
            return (
              <tr key={user.id}>
                <td>
                  <Link to={{ pathname: '/register/user', query: { id: user.id } }}>
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
                          Approve
                        </a>
                        <a
                          onClick={() => denyUserRequest(user.project, user.id, fetchUserRequests)}
                        >
                          Deny
                        </a>
                      </div>
                    ) : null}
                    {user.status !== 'Pending' && <span>No Action Needed</span>}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserRequests);
