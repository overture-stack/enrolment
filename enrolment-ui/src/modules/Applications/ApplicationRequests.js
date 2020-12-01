import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import { fetchProjects, approveProject, denyProject, projectTerminated } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';
import { fetchAllProjectUsers } from '../ProjectUsers/redux';

const ApplicationRequests = props => {
  const {
    t,
    applications,
    profile,
    projects,
    fetchApplications,
    fetchProjects,
    fetchAllProjectUsers,
    approveProject,
    denyProject,
    projectTerminated,
  } = props;

  const fetchNewData = () => {
    fetchApplications();
    fetchProjects();
    fetchAllProjectUsers();
  };

  return (
    <div className="col-md-12">
      <h4>{t('ApplicationRequests.title')}</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Project Title</th>
            {profile.is_staff && <th>Institution Name</th>}
            {profile.is_staff && <th>Institution Email</th>}
            {profile.is_staff && <th>First Name</th>}
            {profile.is_staff && <th>Last Name</th>}
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Status</th>
            {profile.is_staff && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {!projects.loading &&
            !applications.loading &&
            projects.data.results.map(project => {
              const application = _.find(applications.data.results, { project: project.id });

              // In case there is an oprhaned project with no application
              if (!application) return false;

              return (
                <tr key={application.id}>
                  <td>
                    <Link to={`/view/project/${application.id}`}>
                      {_.truncate(project.project_name, { length: 10, omission: '...' })}
                    </Link>
                  </td>
                  {profile.is_staff && <td>{application.institution_name}</td>}
                  {profile.is_staff && <td>{application.institution_email}</td>}
                  {profile.is_staff && <td>{application.firstname}</td>}
                  {profile.is_staff && <td>{application.lastname}</td>}
                  <td>{project.createdDate}</td>
                  <td>{project.updatedDate}</td>
                  <td>{project.status}</td>
                  {profile.is_staff && (
                    <td>
                      {project.status === 'Pending' ? (
                        <div className="admin-actions">
                          <a href="#" onClick={() => approveProject(project.id, fetchNewData)}>
                            {t('RequestTable.action.approve')}
                          </a>
                          <a href="#" onClick={() => denyProject(project.id, fetchNewData)}>
                            {t('RequestTable.action.deny')}
                          </a>
                        </div>
                      ) : null}
                      {project.status === 'Termination Requested' ? (
                        <a href="#" onClick={() => projectTerminated(project.id, fetchNewData)}>
                          {t('RequestTable.action.confirmTermination')}
                        </a>
                      ) : null}
                      {project.status === 'Approved' || project.status === 'Terminated' ? (
                        <span>{t('RequestTable.action.none')}</span>
                      ) : null}
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
    profile: state.profile.data,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: () => fetchApplications(dispatch),
    fetchProjects: () => fetchProjects(dispatch),
    fetchAllProjectUsers: () => fetchAllProjectUsers(dispatch),
    approveProject: (id, next) => approveProject(dispatch, id, next),
    denyProject: (id, next) => denyProject(dispatch, id, next),
    projectTerminated: (id, next) => projectTerminated(dispatch, id, next),
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ApplicationRequests));
