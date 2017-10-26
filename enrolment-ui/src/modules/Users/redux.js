import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_REQUESTS_REQUEST = 'project/FETCH_REQUESTS_REQUEST';
const FETCH_REQUESTS_SUCCESS = 'project/FETCH_REQUESTS_SUCCESS';
const FETCH_REQUESTS_FAILURE = 'project/FETCH_REQUESTS_FAILURE';

const fetchRequestsStart = emptyActionGenerator(FETCH_REQUESTS_REQUEST);
const fetchRequestsSuccess = payloadActionGenerator(FETCH_REQUESTS_SUCCESS);
const fetchRequestsError = payloadActionGenerator(FETCH_REQUESTS_FAILURE);

/*
* Public async thunk actions (mapped to component props)
*/

export function fetchRequests(dispatch) {
  dispatch(fetchRequestsStart());

  return asyncServices.user
    .fetchUserRequests()
    .then(response => {
      dispatch(fetchRequestsSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchRequestsError(error));
    });
}

/*
* Reducer
*/
const _defaultState = {
  loading: false,
  hasRequests: false,
  data: [],
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case FETCH_REQUESTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_REQUESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        hasRequests: true,
        data: [],
        error: null,
      };
    case FETCH_REQUESTS_FAILURE:
      return {
        ...state,
        loading: false,
        hasRequests: false,
        data: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
