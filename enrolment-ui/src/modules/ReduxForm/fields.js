/*
* Form fields for use with redux-form
*/

import React from 'react';

export const RFPlainInput = ({ name, input, label, type, placeholder }) => (
  <input name={name} className="form-control" {...input} placeholder={placeholder} type={type} />
);

export const RFInput = ({
  name,
  input,
  type,
  placeholder,
  bootstrapClass = 'col-md-12',
  meta: { touched, error, warning },
}) => (
  <div className={bootstrapClass}>
    <input name={name} className="form-control" {...input} placeholder={placeholder} type={type} />
    {touched &&
      ((error && <span className="error">{error}</span>) ||
        (warning && <span className="warning">{warning}</span>))}
  </div>
);

export const RFTextArea = ({
  name,
  input,
  placeholder,
  bootstrapClass = 'col-md-12',
  meta: { touched, error, warning },
}) => (
  <div className={bootstrapClass}>
    <textarea name={name} className="form-control" {...input} placeholder={placeholder} />
    {touched &&
      ((error && <span className="error">{error}</span>) ||
        (warning && <span className="warning">{warning}</span>))}
  </div>
);

export const RFConsent = ({
  name,
  label,
  input,
  placeholder,
  meta: { touched, error, warning },
}) => (
  <label className="form-check-label col-md-12">
    <input
      name={name}
      className="form-check-input"
      {...input}
      placeholder={placeholder}
      type="checkbox"
    />
    <span>{label}</span>
    {touched &&
      ((error && <span className="error">{error}</span>) ||
        (warning && <span className="warning">{warning}</span>))}
  </label>
);
