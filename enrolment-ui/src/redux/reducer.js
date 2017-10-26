import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { reducer as login } from '../modules/Login';
import { reducer as auth } from '../modules/Auth';
import { reducer as application } from '../modules/Application';
import { reducer as profile } from '../modules/Profile';
import { reducer as projects } from '../modules/Projects';
import { reducer as users } from '../modules/Users';

const reducer = combineReducers({
  login,
  auth,
  application,
  profile,
  projects,
  users,
  form: formReducer,
});

export default reducer;
