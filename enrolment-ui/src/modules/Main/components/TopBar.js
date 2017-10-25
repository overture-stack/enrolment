import React from 'react';

const TopBar = props => {
  return (
    <div className="top-bar">
      <div className="link-container">
        <a
          className="links"
          href="http://www.cancercollaboratory.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Collaboratory Website
        </a>
        <span className="links"> | </span>
        <a
          className="links"
          href="https://console.cancercollaboratory.org/horizon/auth/login/?next=/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Collaboratory Console
        </a>
      </div>
    </div>
  );
};

TopBar.displayName = 'TopBar';

export default TopBar;
