import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const StaffActions = props => {
  const { profile } = props;

  // TEMP
  const state = { approved: true, showModal: false };

  return (
    <div className="requests-actions">
      <Link to="register/project" className="btn btn-default">
        Register Project
      </Link>
      {state.approved
        ? !profile.is_staff && (
            <Button href="#" onClick={() => console.log('show modal!')}>
              Enroll Users
            </Button>
          )
        : null}
    </div>
  );
};

StaffActions.displayName = 'StaffActions';

const mapStateToProps = state => {
  return {
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffActions);
