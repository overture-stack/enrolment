import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const UserRequests = props => {
  const { profile, userRequests } = props;

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
            {profile.is_staff && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {userRequests.data.map(user => {
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
                {props.profile.is_staff && (
                  <td>
                    {user.status === 'Pending' && (
                      <div className="admin-actions">
                        <a onClick={() => console.log('approveRequest(user.id)')}>Approve</a>
                        <a onClick={() => console.log('denyRequest(user.id)')}>Deny</a>
                      </div>
                    )}
                    {user.status !== 'Pending' && <span>No Action Needed</span>}
                  </td>
                )}
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
    profile: state.profile,
    userRequests: state.userRequests,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRequests);
