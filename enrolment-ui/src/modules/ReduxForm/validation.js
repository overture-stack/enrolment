/*
* Validaton rules
*/

export const rules = {
  required: value => (value ? undefined : 'Required'),

  maxLength: max => value =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined,

  minLength: min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined,

  number: value => (value && isNaN(Number(value)) ? 'Must be a number' : undefined),

  minValue: min => value => (value && value < min ? `Must be at least ${min}` : undefined),

  email: value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ? 'Invalid email address'
      : undefined,

  url: value =>
    value &&
    !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i.test(
      value,
    )
      ? 'Invalid URL (example: http(s)://www.example.com)'
      : undefined,

  mustNotMatch: (existing, msg) => value => {
    if(value && existing.toLowerCase() === value.toLowerCase()) {
      return msg ? msg : `${value} must be different from ${existing}`;
    } else {
      return undefined;
    }
  }
};
