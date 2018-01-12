import React from 'react';
import { translate } from 'react-i18next';
import { getOneConfig } from '../../../config';

const TopBar = props => {
  const { i18n } = props;
  const { multiLingual } = getOneConfig('multiLingual');

  const renderLanguagePicker = () => {
    const activeLanguageClass = (currentLang, button) => {
      if (currentLang === button) return 'btn btn-primary btn-toggles active';
      return 'btn btn-primary btn-toggles';
    };

    return (
      <div className="lang-toggle">
        <button
          className={activeLanguageClass(i18n.language, 'en')}
          onClick={() => i18n.changeLanguage('en')}
        >
          EN
        </button>
        <button
          className={activeLanguageClass(i18n.language, 'fr')}
          onClick={() => i18n.changeLanguage('fr')}
        >
          FR
        </button>
      </div>
    );
  };

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
          href="https://console.cancercollaboratory.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Collaboratory Console
        </a>
      </div>
      {multiLingual ? renderLanguagePicker() : null}
    </div>
  );
};

TopBar.displayName = 'TopBar';

export default translate()(TopBar);
