import React from 'react';

import ChangeLogin from './ChangeLogin';

const InternalLoginForm = props => {
  return (
    <div className="login-container">
      <div className="login-container">
        <form>
          <input type="text" placeholder="Username" className="form-control" name="username" />
          <input type="email" placeholder="Email" className="form-control" name="email" />
          <input type="password" placeholder="Password" className="form-control" name="password" />
          <input type="submit" name="Submit" className="submit action-button" value="Submit" />
        </form>
      </div>
      <ChangeLogin />
    </div>
  );
};

InternalLoginForm.displayName = 'InternalLoginForm';

export default InternalLoginForm;
