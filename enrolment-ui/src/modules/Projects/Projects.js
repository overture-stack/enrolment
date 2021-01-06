import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Button, Col } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

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
import { fetchProjectUsersByProjectId, clearProjectUsers } from '../ProjectUsers/redux';
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
    this.props.clearProjectUsers();
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
      fetchProjectUsersByProjectId,
      clearProjectUsers,
      uiSelectTab,
      toggleModal,
    } = this.props;

    const projectIsSelected = selectedProject.length > 0;

    const hasApprovedProjects =
      projects.data.filter(project => project.status === 'Approved').length > 0;

    const selectTab = tabIdx => {
      // Reload Project Users if selected else clear
      if (tabIdx === 3) {
        if (projectIsSelected) {
          fetchProjectUsersByProjectId(selectedProject);
        } else {
          clearProjectUsers();
        }
      }

      uiSelectTab(tabIdx);
    }

    return (
      <div className="wrapper">
        <div className="inner">
          <h1>My Projects</h1>
          <div className="container">
            <div className="form-group row project-selector">
              <Col md={2}>
                <p style={{ fontSize: '1.24rem' }}>Select Project</p>
              </Col>
              <Col md={3} xs={6}>
                <select
                  className="form-control"
                  value={selectedProject}
                  name="project"
                  onChange={this.handleProjectSelect}
                >
                  <option value="">Select a Project</option>
                  {projects.loading
                    ? null
                    : projects.data
                        .filter(project => project.status === 'Approved')
                        .map(project => (
                          <option value={project.id} key={project.id}>
                            {project.project_name}
                          </option>
                        ))}
                </select>
              </Col>
              {hasApprovedProjects && (
                <Col
                    md={{
                        span: 3,
                        offset: 4,
                    }}
                    xs={6}
                    className="project-terminate-button-col"
                    >
                    <Button href="#" onClick={toggleModal} variant="default">
                        {t('StaffActions.terminate')}
                    </Button>
                </Col>
              )}
            </div>
              <Tabs
                id="projectsNavigation"
                activeKey={activeTab}
                onSelect={selectTab}
                className={`tabs${projectIsSelected ? ' selected' : ''}`}
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
    clearProjectUsers: () => dispatch(clearProjectUsers()),
    uiSelectProject: project => dispatch(uiSelectProject(project)),
    uiSelectTab: tabIdx => dispatch(uiSelectTab(tabIdx)),
    resetEnrolmentForm: () => dispatch(resetEnrolmentForm()),
    toggleModal: () => dispatch(toggleProjectTerminationModal()),
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Projects));
