import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_USERS_REQUEST = 'projectUsers/FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'projectUsers/FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'projectUsers/FETCH_USERS_FAILURE';

const fetchProjectUsersStart = emptyActionGenerator(FETCH_USERS_REQUEST);
const fetchProjectUsersSuccess = payloadActionGenerator(FETCH_USERS_SUCCESS);
const fetchProjectUsersError = payloadActionGenerator(FETCH_USERS_FAILURE);

const FETCH_ONE_REQUEST = 'projectUsers/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS = 'projectUsers/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE = 'projectUsers/FETCH_ONE_FAILURE';

const fetchOneUserStart = emptyActionGenerator(FETCH_ONE_REQUEST);
const fetchOneUserSuccess = payloadActionGenerator(FETCH_ONE_SUCCESS);
const fetchOneUserError = payloadActionGenerator(FETCH_ONE_FAILURE);

/*
* Public async thunk actions (mapped to component props)
*/

export function fetchProjectUsers(dispatch, projectId) {
  dispatch(fetchProjectUsersStart());

  return asyncServices.project
    .fetchProjectUsers(projectId)
    .then(response => {
      dispatch(fetchProjectUsersSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchProjectUsersError(error));
    });
}

export function fetchOneProjectUser(dispatch, projectId, id) {
  dispatch(fetchOneUserStart());

  return asyncServices.project
    .fetchProjectUser(projectId, id)
    .then(response => {
      dispatch(fetchOneUserSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchOneUserError(error));
    });
}

/*
* Reducers
*/

// Project Users
const _defaultState = {
  loading: false,
  hasProjectUsers: false,
  data: [],
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        hasProjectUsers: action.payload.length > 0,
        data: action.payload,
        error: null,
      };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, hasProjectUsers: false, data: [], error: action.payload };
    default:
      return state;
  }
};

// Single Project Users
const _defaultSingleState = {
  loading: false,
  data: {},
  error: null,
  hasFetched: false,
};

export const projectUserReducer = (state = _defaultSingleState, action) => {
  switch (action.type) {
    case FETCH_ONE_REQUEST:
      return { ...state, loading: true, hasFetched: false };
    case FETCH_ONE_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null, hasFetched: true };
    case FETCH_ONE_FAILURE:
      return { ...state, loading: false, data: {}, error: action.payload, hasFetched: true };
    default:
      return state;
  }
};
