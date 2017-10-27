import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const ApplicationRequests = props => {
  const { applications, profile, projects } = props;

  return (
    <div className="col-md-12">
      <h4>Application Requests</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Project Title</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Status</th>
            {profile.is_staff && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {applications.data.map(application => {
            const project = _.find(projects.data, { id: application.project });

            return (
              <tr key={application.id}>
                <td>
                  <Link to={{ pathname: '/register/project', query: { id: application.id } }}>
                    {_.truncate(application.id, { length: 10, omission: '...' })}
                  </Link>
                </td>
                <td>{project.project_name}</td>
                <td>{project.createdDate}</td>
                <td>{project.updatedDate}</td>
                <td>{project.status}</td>
                {props.profile.is_staff && (
                  <td>
                    {project.status === 'Pending' && (
                      <div className="admin-actions">
                        <a onClick={() => console.log('Approve project!')}>Approve</a>
                        <a onClick={() => console.log('Deny project!')}>Deny</a>
                      </div>
                    )}
                    {project.status !== 'Pending' && <span>No Action Needed</span>}
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

ApplicationRequests.displayName = 'ApplicationRequests';

const mapStateToProps = state => {
  return {
    applications: state.applications,
    profile: state.profile,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationRequests);
