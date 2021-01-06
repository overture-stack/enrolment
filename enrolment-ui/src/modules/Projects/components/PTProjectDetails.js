import React from 'react';
import { connect } from 'react-redux';

const PTProjectDetails = props => {
  const { project: { loading, data } } = props;

  if (loading) return false;
  // TODO - billing_status
  const {
    project_description = '',
    pi = '',
    // status = '',
    // billing_status = 'Outstanding Invoice or Usage',
  } = data;

  return (
        <div className="inner">
          <div className="row">
            <div className="col-md-12">
              <h2>Project Details</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="project-detail">
                <h4>Principal Investigator</h4>
                <span>{pi}</span>
              </div>
              <div className="project-detail">
                <h4>Project Description</h4>
                <textarea disabled={true} value={project_description} />
              </div>
            </div>
            {/*

            ... Maybe one day we will allow projects
            of various status's to be displayed here ...
            and integrate with biling ... but not yet ...

            <div className="col-md-6">
              <div className="project-detail">
                <h4>Project Status</h4>
                <span>{status}</span>
              </div>
              <div className="project-detail">
                <h4>Billing Status</h4>
                <span>{billing_status}</span>
              </div>
            </div>

            */}
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
