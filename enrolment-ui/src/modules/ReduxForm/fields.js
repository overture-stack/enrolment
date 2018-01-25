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
  disabled,
}) => (
  <div className={bootstrapClass}>
    <input
      name={name}
      className="form-control"
      {...input}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
    />
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
  disabled,
}) => (
  <div className={bootstrapClass}>
    <textarea
      name={name}
      className="form-control"
      {...input}
      placeholder={placeholder}
      disabled={disabled}
    />
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
  disabled,
}) => (
  <label className="form-check-label col-md-12">
    <input
      name={name}
      className="form-check-input"
      {...input}
      placeholder={placeholder}
      type="checkbox"
      disabled={disabled}
    />
    <span>{label}</span>
    {touched &&
      ((error && <span className="error">{error}</span>) ||
        (warning && <span className="warning">{warning}</span>))}
  </label>
);

export const RFSelect = ({
  name,
  input,
  bootstrapClass = 'col-md-12',
  defaultOption,
  options,
  meta: { touched, error, warning },
  disabled,
}) => (
  <div className={bootstrapClass}>
    <select className="form-control" id={name} {...input} disabled={disabled}>
      <option value="">{defaultOption}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
    {touched &&
      ((error && <span className="error">{error}</span>) ||
        (warning && <span className="warning">{warning}</span>))}
  </div>
);

export const RFSelectFlat = ({
  name,
  defaultOption,
  options,
  input,
  bootstrapClass = 'col-md-12',
  meta: { touched, error, warning },
  disabled,
}) => {
  return (
    <div className={bootstrapClass}>
      <select className="form-control" id={name} {...input} disabled={disabled}>
        <option value="">{defaultOption}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      {touched &&
        ((error && <span className="error">{error}</span>) ||
          (warning && <span className="warning">{warning}</span>))}
    </div>
  );
};
