import { compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';

import reducer from './reducer';

const composedStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
  persistState(),
)(createStore);

const configureStore = initialState => composedStore(reducer, initialState);

export default configureStore;
