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
      return { ...state, loading: false, hasProjectUsers: true, data: action.payload, error: null };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, hasProjectUsers: false, data: [], error: action.payload };
    default:
      return state;
  }
};
