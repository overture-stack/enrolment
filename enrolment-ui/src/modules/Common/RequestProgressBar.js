import React from 'react';

const RequestProgressBar = props => {
  const { steps, active } = props;
  return (
    <ul className="progressbar">
      {steps.map((step, index) => {
        return (
          <li key={index} className={active > index ? 'active' : ''}>
            {step}
          </li>
        );
      })}
    </ul>
  );
};

RequestProgressBar.displayName = 'RequestProgressBar';

export default RequestProgressBar;
