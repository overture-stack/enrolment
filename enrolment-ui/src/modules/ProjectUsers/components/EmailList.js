import React, { Component } from 'react';
import { connect } from 'react-redux';

import { emailCheck, removeEmail } from '../redux';

import './emailList.scss';
import spinner from '../../../assets/img/spinner.svg';

class EmailList extends Component {
  static displayName = 'EmailList';

  constructor(props) {
    super(props);

    this.state = {
      emailField: '',
      emailFieldError: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const currentEmails = this.props.userEnrolmentForm.users;
    const nextEmails = nextProps.userEnrolmentForm.users;
    if (currentEmails.length !== nextEmails.length) {
      const emails = nextEmails.length > 0 ? { emails: nextEmails } : '';
      this.onChange(this.state, emails);
    }
  }

  addEmail(event) {
    event.preventDefault();

    const email = this.state.emailField;
    const users = this.props.userEnrolmentForm.users;
    const project =  this.props.project.data.id;

    if (users.indexOf(email) !== -1)
      return this.setState({
        ...this.state,
        emailField: '',
        emailFieldError: '',
      });

    this.props.emailCheck(project, email);

    const newState = {
      ...this.state,
      emailField: '', // clear email field
    };

    return this.onChange(newState);
  }

  onChange(newState = this.state, emails = false) {
    // Get redux-form onChange function from props
    const { input: { onChange }, userEnrolmentForm: { users } } = this.props;

    const formValue = users.length > 0 ? { emails: users } : '';

    // If we pass emails update to those emails
    if (emails !== false) {
      onChange(emails);
    } else {
      onChange(formValue);
    }

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
                <a className="remove-link" onClick={() => this.props.removeEmail(email)}>
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
    const {
      input: { name },
      label,
      meta: { touched, error, warning },
      userEnrolmentForm: { users, isFetching },
    } = this.props;

    const { emailField } = this.state;

    return (
      <div>
        <div className="form-group row">
          <div className="col-md-4">
            <label htmlFor={name}>{label}</label>
          </div>
          <div className={`col-md-6 user-email ${isFetching ? 'fetching' : ''}`}>
            <input
              type="email"
              name={name}
              onChange={event => this.onEmailFieldChange(event)}
              value={emailField}
            />
            <img src={spinner} alt="Loading graphic" />
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

        {users.length > 0 ? this.renderEmailList(users) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
    userEnrolmentForm: state.userEnrolmentForm,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    emailCheck: (project, email) => emailCheck(dispatch, project, email),
    removeEmail: email => dispatch(removeEmail(email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailList);
