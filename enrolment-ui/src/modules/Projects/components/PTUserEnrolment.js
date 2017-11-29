import React from 'react';
import { connect } from 'react-redux';
import TabReqForm from '../../ProjectUsers/components/TabReqForm';
import { createProjectUsers, fetchAllProjectUsers } from '../../ProjectUsers/redux';

const onSubmit = (createUsers, user, projectId, next) => {
  return data => {
    // Process data for submission
    const proccessedData = data.email.emails.map(email => ({
      project: projectId,
      daco_email: email,
      user,
    }));

    createUsers(projectId, proccessedData, next);
  };
};

const PTUserEnrolment = props => {
  const { createProjectUsers, profile: { pk }, project, fetchAllProjectUsers } = props;

  return (
    <div className="container">
      <div className="inner">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>User Enrollment</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <p>
                In order to enroll a user to your Collaboratory project, the user should have a DACO
                account
              </p>
            </div>
          </div>
          <div className="row tab-req-form">
            <div className="col-md-8">
              <TabReqForm
                onSubmit={onSubmit(createProjectUsers, pk, project.id, fetchAllProjectUsers)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PTUserEnrolment.displayName = 'PTUserEnrolment';

const mapStateToProps = state => {
  return {
    profile: state.profile.data,
    project: state.project.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createProjectUsers: (projectId, data, next) =>
      createProjectUsers(dispatch, projectId, data, next),
    fetchAllProjectUsers: () => fetchAllProjectUsers(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PTUserEnrolment);
