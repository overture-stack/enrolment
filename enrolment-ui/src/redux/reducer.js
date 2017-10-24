import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { reducer as application } from '../modules/Application';

const reducer = combineReducers({
  form: formReducer,
  application,
});

export default reducer;
