import React from 'react';
import { connect } from 'react-redux';

const PTProjectDetails = props => {
  const { data: { project_description, pi } } = props.project;

  return (
    <div className="container">
      <div className="inner">
        <h2>Project Details</h2>
        <div className="container">
          <div className="inner">
            <h4>Principal Investigator</h4>
            <div className="container">
              <span>{pi}</span>
            </div>
            <h4>Project Description</h4>
            <textarea disabled={true} value={project_description} />
          </div>
        </div>
      </div>
    </div>
  );
};

PTProjectDetails.displayName = 'PTProjectDetails';

const mapStateToProps = state => {
  return {
    project: state.project,
  };
};

export default connect(mapStateToProps, null)(PTProjectDetails);
