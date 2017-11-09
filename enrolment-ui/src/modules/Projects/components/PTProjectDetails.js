import React from 'react';
import { connect } from 'react-redux';

const PTProjectDetails = props => {
  const { project_description = '', pi = '' } = props.project;

  return (
    <div className="container">
      <div className="inner">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Project Details</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h4>Principal Investigator</h4>
              <span>{pi}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h4>Project Description</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <textarea disabled={true} value={project_description} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PTProjectDetails.displayName = 'PTProjectDetails';

const mapStateToProps = state => {
  return {
    project: state.project.data,
  };
};

export default connect(mapStateToProps, null)(PTProjectDetails);
