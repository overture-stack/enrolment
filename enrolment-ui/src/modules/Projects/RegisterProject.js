import React from 'react';

import ReqForm from './components/ReqForm';
import ReqSuccessModal from './components/ReqSuccessModal';

import './registerProject.scss';

const RegisterProject = props => {
  return (
    <div className="wrapper">
      <h2 style={{ textAlign: 'center' }}>Register a Project</h2>
      <div className="project-registration">
        <ReqForm />
      </div>
      <ReqSuccessModal showModal={false} handleClose={() => console.log('handleClose()')} />
    </div>
  );
};

RegisterProject.displayName = 'RegisterProject';

export default RegisterProject;
