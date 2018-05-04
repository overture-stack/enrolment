import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { translate } from 'react-i18next';

import PTProjectDetails from './components/PTProjectDetails';
import PTUserEnrolment from './components/PTUserEnrolment';
import PTUserDetails from './components/PTUserDetails';
import ProjectTerminationModal from './ProjectTerminationModal';

import {
  fetchOneProject,
  fetchProjects,
  uiSelectProject,
  uiSelectTab,
  toggleProjectTerminationModal,
} from '../Projects/redux';
import { fetchProjectUsersByProjectId } from '../ProjectUsers/redux';
import { resetEnrolmentForm } from '../ProjectUsers/redux';

import './projects.scss';

class Projects extends Component {
  static displayName = 'Projects';

  constructor(props) {
    super(props);

    // Get initial data
    this.resetAndFetchNewData = this.resetAndFetchNewData.bind(this);
    this.resetAndFetchNewData();

    // Bind class methods
    this.handleProjectSelect = this.handleProjectSelect.bind(this);

    // Go to tab based on hash
    const hash = this.props.location.hash;
    if (hash === '#viewUsers') {
      this.props.uiSelectTab(3);
    } else if (hash === '#addUsers') {
      this.props.uiSelectTab(2);
    }
  }

  resetAndFetchNewData() {
    this.props.uiSelectProject('');
    this.props.uiSelectTab(1);
    this.props.fetchProjects();
  }

  handleProjectSelect(event) {
    const {
      uiSelectProject,
      resetEnrolmentForm,
      fetchOneProject,
      fetchProjectUsersByProjectId,
    } = this.props;
    const projectId = event.target.value;

    if (projectId) {
      fetchOneProject(projectId);
      fetchProjectUsersByProjectId(projectId);
    }

    uiSelectProject(projectId);
    resetEnrolmentForm();
  }

  renderNoProjectTab() {
    return <h2>No Project has been selected.</h2>;
  }

  render() {
    const {
      t,
      projects,
      projectsUI: { selectedProject, activeTab },
      uiSelectTab,
      toggleModal,
    } = this.props;

    const projectIsSelected = selectedProject.length > 0;

    const hasApprovedProjects =
      projects.data.results.filter(project => project.status === 'Approved').length > 0;

    return (
      <div className="wrapper">
        <div className="inner">
          <h1>My Projects</h1>
          <div className="container">
            <div className="form-group row project-selector">
              <div className="col-md-2">
                <h4>Select Project</h4>
              </div>
              <div className="col-xs-6 col-md-3">
                <select
                  className="form-control"
                  value={selectedProject}
                  name="project"
                  onChange={this.handleProjectSelect}
                >
                  <option value="">Select a Project</option>
                  {projects.loading
                    ? null
                    : projects.data.results
                        .filter(project => project.status === 'Approved')
                        .map(project => (
                          <option value={project.id} key={project.id}>
                            {project.project_name}
                          </option>
                        ))}
                </select>
              </div>
              {hasApprovedProjects ? (
                <div className="col-xs-6 col-md-3 col-md-push-4 project-terminate-button-col">
                  <Button href="#" onClick={toggleModal}>
                    {t('StaffActions.terminate')}
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="nav">
              <Tabs
                id="projectsNavigation"
                activeKey={activeTab}
                onSelect={uiSelectTab}
                className={`tabs ${projectIsSelected ? 'selected' : ''}`}
              >
                <Tab
                  eventKey={1}
                  title="Project Details"
                  className={!projectIsSelected ? 'no-project' : ''}
                >
                  {projectIsSelected ? <PTProjectDetails /> : this.renderNoProjectTab()}
                </Tab>
                <Tab
                  eventKey={2}
                  title="User Enrolment"
                  className={!projectIsSelected === 0 ? 'no-project' : ''}
                >
                  {projectIsSelected ? <PTUserEnrolment /> : this.renderNoProjectTab()}
                </Tab>
                <Tab
                  eventKey={3}
                  title="Users Details"
                  className={!projectIsSelected === 0 ? 'no-project' : ''}
                >
                  {projectIsSelected ? <PTUserDetails /> : this.renderNoProjectTab()}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <ProjectTerminationModal />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.projects,
    projectsUI: state.projectsUI,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchOneProject: id => fetchOneProject(dispatch, id),
    fetchProjects: () => fetchProjects(dispatch),
    fetchProjectUsersByProjectId: projectId => fetchProjectUsersByProjectId(dispatch, projectId),
    uiSelectProject: project => dispatch(uiSelectProject(project)),
    uiSelectTab: tabIdx => dispatch(uiSelectTab(tabIdx)),
    resetEnrolmentForm: () => dispatch(resetEnrolmentForm()),
    toggleModal: () => dispatch(toggleProjectTerminationModal()),
  };
};

export default translate()(connect(mapStateToProps, mapDispatchToProps)(Projects));
