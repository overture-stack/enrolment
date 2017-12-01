import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate, Trans } from 'react-i18next';
import _ from 'lodash';

import { fetchProjects, approveProject, denyProject } from '../Projects/redux';
import { fetchApplications } from '../Applications/redux';

const ApplicationRequests = props => {
  const {
    t,
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
      <h4>{t('ApplicationRequests.title')}</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <Trans
            i18nKey={
              profile.is_staff ? 'RequestTable.tableHeaderAdmin' : 'RequestTable.tableHeader'
            }
            parent="tr"
          >
            <th>Request ID</th>
            <th>Project Title</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Status</th>
            {profile.is_staff ? <th>Action</th> : null}
          </Trans>
        </thead>
        <tbody>
          {projects.results
            ? projects.results.map(project => {
                const application = _.find(applications.results, { project: project.id });

                // In case there is an oprhaned project with no application
                if (!application) return false;

                return (
                  <tr key={application.id}>
                    <td>
                      <Link to={`/view/project/${application.id}`}>
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
                            <a onClick={() => approveProject(project.id, fetchNewData)}>
                              {t('RequestTable.action.approve')}
                            </a>
                            <a onClick={() => denyProject(project.id, fetchNewData)}>
                              {t('RequestTable.action.deny')}
                            </a>
                          </div>
                        )}
                        {project.status !== 'Pending' ? (
                          <span>{t('RequestTable.action.none')}</span>
                        ) : null}
                      </td>
                    ) : null}
                  </tr>
                );
              })
            : null}
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

export default translate()(connect(mapStateToProps, mapDispatchToProps)(ApplicationRequests));
