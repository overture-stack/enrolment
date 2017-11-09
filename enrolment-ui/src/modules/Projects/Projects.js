import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import PTProjectDetails from './components/PTProjectDetails';
import PTUserEnrolment from './components/PTUserEnrolment';
import PTUserDetails from './components/PTUserDetails';

import { fetchOneProject, fetchProjects, uiSelectProject, uiSelectTab } from '../Projects/redux';
import { fetchProjectUsers } from '../ProjectUsers/redux';

import './projects.scss';

class Projects extends Component {
  static displayName = 'Projects';

  constructor(props) {
    super(props);

    // Get initial data
    this.fetchNewData = this.fetchNewData.bind(this);
    this.fetchNewData();

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

  fetchNewData() {
    this.props.fetchProjects();
  }

  handleProjectSelect(event) {
    const { uiSelectProject } = this.props;
    const projectId = event.target.value;

    this.props.fetchOneProject(projectId);
    this.props.fetchProjectUsers(projectId);
    uiSelectProject(projectId);
  }

  renderNoProjectTab() {
    return <h2>No Project has been selected.</h2>;
  }

  render() {
    const { projects, projectsUI: { selectedProject, activeTab }, uiSelectTab } = this.props;

    const projectIsSelected = selectedProject.length > 0;

    return (
      <div className="wrapper">
        <div className="inner">
          <h1>My Projects</h1>
          <div className="container">
            <div className="form-group row project-selector">
              <div className="col-md-2">
                <h4>Select Project</h4>
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={selectedProject}
                  name="project"
                  onChange={this.handleProjectSelect}
                >
                  <option value="">Select a Project</option>
                  {projects.data.results
                    .filter(project => project.status === 'Approved')
                    .map(project => (
                      <option value={project.id} key={project.id}>
                        {project.project_name}
                      </option>
                    ))}
                </select>
              </div>
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
    fetchProjectUsers: projectId => fetchProjectUsers(dispatch, projectId),
    uiSelectProject: project => dispatch(uiSelectProject(project)),
    uiSelectTab: tabIdx => dispatch(uiSelectTab(tabIdx)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
