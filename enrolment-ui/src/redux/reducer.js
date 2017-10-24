import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { reducer as login } from '../modules/Login';
import { reducer as application } from '../modules/Application';

const reducer = combineReducers({
  login,
  application,
  form: formReducer,
});

export default reducer;
