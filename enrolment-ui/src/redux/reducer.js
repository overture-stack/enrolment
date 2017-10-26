import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { reducer as login } from '../modules/Login';
import { reducer as auth } from '../modules/Auth';
import { reducer as applications } from '../modules/Applications';
import { reducer as profile } from '../modules/Profile';
import { reducer as projects, requestFormReducer as projectRequestForm } from '../modules/Projects';
import { reducer as users } from '../modules/Users';

const reducer = combineReducers({
  login,
  auth,
  applications,
  profile,
  projects,
  projectRequestForm,
  users,
  form: formReducer,
});

export default reducer;
