import React from 'react';
import { connect } from 'react-redux';
import TabReqForm from '../../ProjectUsers/components/TabReqForm';
import { createProjectUsers } from '../../ProjectUsers/redux';

const onSubmit = enroll => {
  return data => {
    // Process data for submission
    const proccessedData = data.email.emails.map(email => ({ project: data.project, email }));

    enroll(proccessedData);
  };
};

const PTUserEnrolment = props => {
  const { createProjectUsers } = props;

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
              <TabReqForm onSubmit={onSubmit(createProjectUsers)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PTUserEnrolment.displayName = 'PTUserEnrolment';

const mapDispatchToProps = dispatch => {
  return {
    createProjectUsers: data => createProjectUsers(dispatch, data),
  };
};

export default connect(null, mapDispatchToProps)(PTUserEnrolment);
