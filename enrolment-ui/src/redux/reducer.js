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
} from '../modules/Projects';
import {
  reducer as users,
  userEnrolmentModalReducer as userEnrolmentModal,
} from '../modules/Users';

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
  users,
  userEnrolmentModal,
  form,
});

export default reducer;
