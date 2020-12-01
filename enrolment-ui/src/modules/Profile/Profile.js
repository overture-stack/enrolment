import React from 'react';
import { connect } from 'react-redux';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { DropdownButton, Button } from 'react-bootstrap';

import { logout } from '../Auth/redux';

import './styles.scss';

const Profile = props => {
    const { profile: { data: { email, social } }, logout } = props;

    return (
        <DropdownButton
            className="user-dropdown"
            id="user-dropdown"
            menuAlign="right"
            title={(
                <img
                alt="user profile thumbnail"
                src={social.picture}
                />
            )}
            >
            <DropdownItem eventKey="1">
                <div className="user-info">
                    <div className="user-picture">
                        <img src={social.picture} alt="user profile thumbnail" />
                    </div>

                    <div className="user-text">
                        <span>
                            <b>{social.name}</b>
                        </span>

                        <br />

                        <span>{email}</span>
                    </div>
                </div>
            </DropdownItem>

            <DropdownItem className="user-logout">
                <Button
                    onClick={logout}
                    variant="default"
                    >
                    Log Out
                </Button>
            </DropdownItem>
        </DropdownButton>
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
