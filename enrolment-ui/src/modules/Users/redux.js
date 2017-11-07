import _ from 'lodash';
import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_REQUESTS_REQUEST = 'user/FETCH_REQUESTS_REQUEST';
const FETCH_REQUESTS_SUCCESS = 'user/FETCH_REQUESTS_SUCCESS';
const FETCH_REQUESTS_FAILURE = 'user/FETCH_REQUESTS_FAILURE';

const ENROLL_USERS_REQUEST = 'user/ENROLL_USERS_REQUEST';
const ENROLL_USERS_SUCCESS = 'user/ENROLL_USERS_SUCCESS';
const ENROLL_USERS_FAILURE = 'user/ENROLL_USERS_FAILURE';

const DACO_CHECK_REQUEST = 'user/DACO_CHECK_REQUEST';
const DACO_CHECK_SUCCESS = 'user/DACO_CHECK_SUCCESS';
const DACO_CHECK_FAILURE = 'user/DACO_CHECK_FAILURE';
const REMOVE_EMAIL = 'user/REMOVE_EMAIL';

const TOGGLE_MODAL = 'user/TOGGLE_MODAL';

const fetchRequestsStart = emptyActionGenerator(FETCH_REQUESTS_REQUEST);
const fetchRequestsSuccess = payloadActionGenerator(FETCH_REQUESTS_SUCCESS);
const fetchRequestsError = payloadActionGenerator(FETCH_REQUESTS_FAILURE);

const dacoCheckStart = emptyActionGenerator(DACO_CHECK_REQUEST);
const dacoCheckSuccess = payloadActionGenerator(DACO_CHECK_SUCCESS);
const dacoCheckError = payloadActionGenerator(DACO_CHECK_FAILURE);

const enrollUsersStart = emptyActionGenerator(ENROLL_USERS_REQUEST);
const enrollUsersSuccess = payloadActionGenerator(ENROLL_USERS_SUCCESS);
const enrollUsersError = payloadActionGenerator(ENROLL_USERS_FAILURE);

/*
* Public actions
*/

export const toggleModal = emptyActionGenerator(TOGGLE_MODAL);
export const removeEmail = payloadActionGenerator(REMOVE_EMAIL);

/*
* Public async thunk actions (mapped to component props)
*/

export function fetchUserRequests(dispatch) {
  dispatch(fetchRequestsStart());

  return asyncServices.user
    .fetchAllProjectUserRequests()
    .then(response => {
      dispatch(fetchRequestsSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchRequestsError(error));
    });
}

export function enrollUsers(dispatch, data) {
  dispatch(enrollUsersStart());

  return asyncServices.user
    .userRequest(data)
    .then(response => {
      dispatch(enrollUsersSuccess(response.data));
    })
    .catch(error => {
      dispatch(enrollUsersError(error));
    });
}

export function dacoCheck(dispatch, email) {
  dispatch(dacoCheckStart());

  return asyncServices.user
    .dacoCheck(email)
    .then(response => {
      dispatch(dacoCheckSuccess(email));
    })
    .catch(error => {
      dispatch(dacoCheckError(error));
    });
}

/*
* Reducer
*/

// User Request Reducer
const _defaultUserRequestState = {
  loading: false,
  hasRequests: false,
  data: [],
  error: null,
};

export const userRequestReducer = (state = _defaultUserRequestState, action) => {
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
        data: action.payload,
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
  isFetching: false,
  submitSuccess: false,
  error: null,
  users: [],
};

export const userEnrolmentModalReducer = (state = _defaultUserEnrolmentModalState, action) => {
  switch (action.type) {
    case DACO_CHECK_REQUEST:
    case ENROLL_USERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case DACO_CHECK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: [...state.users, action.payload],
      };
    case DACO_CHECK_FAILURE:
    case ENROLL_USERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case ENROLL_USERS_SUCCESS:
      return {
        ..._defaultUserEnrolmentModalState,
        show: true,
        submitSuccess: true,
      };
    case REMOVE_EMAIL: {
      const users = [...state.users];
      _.remove(users, e => e === action.payload);
      return {
        ...state,
        users,
      };
    }
    case TOGGLE_MODAL:
      return {
        ..._defaultUserEnrolmentModalState,
        show: !state.show,
      };
    default:
      return state;
  }
};
