import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import { reducer as login } from '../modules/Login';
import { reducer as auth } from '../modules/Auth';
import {
  reducer as applications,
  applicationReducer as application,
} from '../modules/Applications';
import { reducer as profile } from '../modules/Profile';
import {
  reducer as projects,
  projectReducer as project,
  projectsUIReducer as projectsUI,
  requestFormReducer as projectRequestForm,
  projectTerminationReducer as projectTerminationModal,
} from '../modules/Projects';
import {
  reducer as projectUsers,
  projectUserReducer as projectUser,
  userEnrolmentFormReducer as userEnrolmentForm,
  userEnrolmentModalReducer as userEnrolmentModal,
  requestFormReducer as userRequestForm,
} from '../modules/ProjectUsers';
import { reducer as fees } from '../modules/Fees';

const reducer = combineReducers({
  login,
  auth,
  applications,
  application,
  profile,
  projects,
  project,
  projectsUI,
  projectRequestForm,
  projectTerminationModal,
  userEnrolmentForm,
  userEnrolmentModal,
  userRequestForm,
  projectUsers,
  projectUser,
  fees,
  form,
});

export default reducer;
