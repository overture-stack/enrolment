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

const PTUserEnrolment = ({
    createProjectUsers,
    profile: { pk },
    project,
    fetchAllProjectUsers,
}) => (
    project.loading
        ? false
        : (
            <div className="inner">
                <div className="row">
                    <div className="col-md-12">
                        <h2>User Enrolment</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {/* <p>
                            In order to enrol a user to your Collaboratory project, the user should have an account
                        </p> */}
                    </div>
                </div>
                <div className="row tab-req-form">
                    <div className="col-md-8">
                        <TabReqForm
                            onSubmit={onSubmit(
                                createProjectUsers,
                                pk,
                                project.data.id,
                                fetchAllProjectUsers
                            )}
                            />
                    </div>
                </div>
            </div>
        )
);

const mapStateToProps = state => {
  return {
    profile: state.profile.data,
    project: state.project,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createProjectUsers: (projectId, data, next) =>
      createProjectUsers(dispatch, projectId, data, next),
    fetchAllProjectUsers: () => fetchAllProjectUsers(dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PTUserEnrolment);
