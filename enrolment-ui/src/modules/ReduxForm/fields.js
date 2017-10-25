/*
* Form fields for use with redux-form
*/

import React from 'react';

export const RFInput = ({
  name,
  input,
  label,
  type,
  placeholder,
  meta: { touched, error, warning },
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <div>
      <input
        name={name}
        className="form-control"
        {...input}
        placeholder={placeholder}
        type={type}
      />
      {touched &&
        ((error && <span className="error">{error}</span>) ||
          (warning && <span className="warning">{warning}</span>))}
    </div>
  </div>
);

// export const RFTextArea = ({
//   name,
//   input,
//   label,
//   placeholder,
//   meta: { touched, error, warning },
// }) => (
//   <div className="form-group">
//     <label htmlFor={name}>{label}</label>
//     <div>
//       <textarea name={name} className="form-control" {...input} placeholder={placeholder} />
//       {touched &&
//         ((error && <span className="error">{error}</span>) ||
//           (warning && <span className="warning">{warning}</span>))}
//     </div>
//   </div>
// );

// export const RFSelect = ({ name, input, label, options, meta: { touched, error, warning } }) => (
//   <div className="form-group">
//     <label htmlFor={name}>{label}</label>
//     <div>
//       <select className="form-control" id={name} {...input}>
//         {options.map((option, idx) => (
//           <option key={idx} value={option.value}>
//             {option.text}
//           </option>
//         ))}
//       </select>
//       {touched &&
//         ((error && <span className="error">{error}</span>) ||
//           (warning && <span className="warning">{warning}</span>))}
//     </div>
//   </div>
// );
