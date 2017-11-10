import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { fetchProjects, approveProject, denyProject } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';

const ApplicationRequests = props => {
  const {
    applications,
    profile,
    projects,
    fetchApplications,
    fetchProjects,
    approveProject,
    denyProject,
  } = props;

  const fetchNewData = () => {
    fetchApplications();
    fetchProjects();
  };

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
            {profile.is_staff ? <th>Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {applications.results.map(application => {
            const project = _.find(projects.results, { id: application.project });

            return (
              <tr key={application.id}>
                <td>
                  <Link to={`/view/project-application/${application.id}`}>
                    {_.truncate(application.id, { length: 10, omission: '...' })}
                  </Link>
                </td>
                <td>{project.project_name}</td>
                <td>{project.createdDate}</td>
                <td>{project.updatedDate}</td>
                <td>{project.status}</td>
                {profile.is_staff ? (
                  <td>
                    {project.status === 'Pending' && (
                      <div className="admin-actions">
                        <a onClick={() => approveProject(project.id, fetchNewData)}>Approve</a>
                        <a onClick={() => denyProject(project.id, fetchNewData)}>Deny</a>
                      </div>
                    )}
                    {project.status !== 'Pending' && <span>No Action Needed</span>}
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

ApplicationRequests.displayName = 'ApplicationRequests';

const mapStateToProps = state => {
  return {
    applications: state.applications.data,
    profile: state.profile.data,
    projects: state.projects.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: () => fetchApplications(dispatch),
    fetchProjects: () => fetchProjects(dispatch),
    approveProject: (id, next) => approveProject(dispatch, id, next),
    denyProject: (id, next) => denyProject(dispatch, id, next),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationRequests);
