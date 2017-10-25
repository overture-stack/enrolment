import React from 'react';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';

import { logout } from '../Auth/redux';

const Profile = props => {
  const { profile, logout } = props;

  return (
    <div>
      <DropdownButton
        className="user-dropdown"
        id="user-dropdown"
        title={<img src={profile.social.picture} alt="user profile thumbnail" />}
        pullRight
        noCaret
      >
        <MenuItem eventKey="1">
          <div className="user-info">
            <div className="user-picture">
              <img src={profile.social.picture} alt="user profile thumbnail" />
            </div>
            <div className="user-text">
              <span>
                <b>{profile.social.name}</b>
              </span>
              <br />
              <span>{profile.email}</span>
            </div>
          </div>
        </MenuItem>
        <MenuItem className="user-logout">
          <Button onClick={logout}>Log Out</Button>
        </MenuItem>
      </DropdownButton>}
    </div>
  );
};

Profile.displayName = 'Profile';

const mapStateToProps = state => {
  return {
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => logout(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
