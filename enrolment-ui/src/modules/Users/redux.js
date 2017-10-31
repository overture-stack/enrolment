import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_REQUESTS_REQUEST = 'user/FETCH_REQUESTS_REQUEST';
const FETCH_REQUESTS_SUCCESS = 'user/FETCH_REQUESTS_SUCCESS';
const FETCH_REQUESTS_FAILURE = 'user/FETCH_REQUESTS_FAILURE';

const TOGGLE_MODAL = 'user/TOGGLE_MODAL';

const fetchRequestsStart = emptyActionGenerator(FETCH_REQUESTS_REQUEST);
const fetchRequestsSuccess = payloadActionGenerator(FETCH_REQUESTS_SUCCESS);
const fetchRequestsError = payloadActionGenerator(FETCH_REQUESTS_FAILURE);

/*
* Public actions
*/

export const toggleModal = emptyActionGenerator(TOGGLE_MODAL);

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

// User Reducer
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

// Enrolment Modal Reducer
const _defaultUserEnrolmentModalState = {
  show: false,
};

export const userEnrolmentModalReducer = (state = _defaultUserEnrolmentModalState, action) => {
  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        show: !state.show,
      };
    default:
      return state;
  }
};
