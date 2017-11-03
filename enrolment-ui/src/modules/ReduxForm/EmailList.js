import React, { Component } from 'react';
import _ from 'lodash';

import './emailList.scss';

export default class EmailList extends Component {
  static displayName = 'EmailList';

  constructor(props) {
    super(props);

    this.state = {
      emailField: '',
      emails: [],
    };

    this.onChange = this.onChange.bind(this);
  }

  addEmail(event) {
    event.preventDefault();

    const newState = {
      ...this.state,
      emails: [...this.state.emails, this.state.emailField],
      emailField: '', // clear email field
    };

    this.onChange(newState);
  }

  removeEmail(email) {
    const emails = [...this.state.emails];
    _.remove(emails, e => e === email);

    const newState = {
      ...this.state,
      emails,
    };

    this.onChange(newState);
  }

  onChange(newState) {
    // Get redux-form onChange function from props
    const { input: { onChange } } = this.props;

    const formValue = newState.emails.length > 0 ? { emails: newState.emails } : '';
    onChange(formValue);

    this.setState(newState);
  }

  onEmailFieldChange(event) {
    this.setState({
      ...this.state,
      emailField: event.target.value,
    });
  }

  renderEmailList(emails) {
    return (
      <div className="user-list">
        <ul>
          {emails.map((email, index) => (
            <li key={index}>
              <div className="email">
                <span>{email}</span>
                <a className="remove-link" onClick={() => this.removeEmail(email)}>
                  Remove
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { input: { name }, label, meta: { touched, error, warning } } = this.props;

    const { emails, emailField } = this.state;

    return (
      <div>
        <div className="form-group row">
          <div className="col-md-4">
            <label htmlFor={name}>{label}</label>
          </div>
          <div className="col-md-6 user-email">
            <input
              type="email"
              name={name}
              onChange={event => this.onEmailFieldChange(event)}
              value={emailField}
            />
          </div>
          <div className="col-md-2">
            <button
              className="action-button small"
              onClick={event => this.addEmail(event)}
              disabled={emailField.length === 0}
            >
              Add
            </button>
          </div>
        </div>

        {touched &&
          ((error && <span className="error">{error}</span>) ||
            (warning && <span className="warning">{warning}</span>))}

        {emails.length > 0 ? this.renderEmailList(emails) : null}
      </div>
    );
  }
}
