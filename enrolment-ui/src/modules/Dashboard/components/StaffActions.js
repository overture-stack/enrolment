import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { toggleModal } from '../../Users/redux';

const StaffActions = props => {
  const { profile, toggleModal } = props;

  // TEMP
  const state = { approved: true, showModal: false };

  return (
    <div className="requests-actions">
      <Link to="register/project" className="btn btn-default">
        Register Project
      </Link>
      {state.approved
        ? !profile.is_staff && (
            <Button href="#" onClick={toggleModal}>
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
  return {
    toggleModal: () => dispatch(toggleModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffActions);
