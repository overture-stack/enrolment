// adapted from: https://github.com/anthonyjgrove/react-google-login/blob/master/src/google-login.js
import React, { useState } from 'react';
import GoogleIcon from './GoogleIcon';

const GoogleLoginButton = ({ buttonText = "Login with Google", children, onClick = () => {} }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const initialStyle = {
    backgroundColor: 'rgb(66, 133, 244)',
    display: 'inline-flex',
    alignItems: 'center',
    color: '#fff',
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)',
    padding: '0 10px 0 0',
    borderRadius: 2,
    border: '1px solid transparent',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto, sans-serif',
    marginBottom: '10px',
  };

  const hoveredStyle = {
    backgroundColor: '#1266f1',
    cursor: 'pointer',
    opacity: 0.9,
  };

  const activeStyle = {
    backgroundColor: '#1266f1',
    cursor: 'pointer',
    opacity: 1.0,
  };

  const defaultStyle = (() => {
    if (active) {
      return Object.assign({}, initialStyle, activeStyle);
    }

    if (hovered) {
      return Object.assign({}, initialStyle, hoveredStyle);
    }

    return initialStyle;
  })();

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setActive(false);
        setHovered(false);
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => {
        setActive(false);
        setHovered(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onClick={() => onClick()}
      style={defaultStyle}
    >
      <GoogleIcon key={1} active={active} />
      {children || buttonText}
    </button>
  );

};

export default GoogleLoginButton;
