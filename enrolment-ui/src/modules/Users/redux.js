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

const SUBMIT_USER_REQUEST = 'user/SUBMIT_USER_REQUEST';
const SUBMIT_USER_SUCCESS = 'user/SUBMIT_USER_SUCCESS';
const SUBMIT_USER_FAILURE = 'user/SUBMIT_USER_FAILURE';

const UPDATE_REQUEST_REQUEST = 'user/UPDATE_REQUEST_REQUEST';
const UPDATE_REQUEST_SUCCESS = 'user/UPDATE_REQUEST_SUCCESS';
const UPDATE_REQUEST_FAILURE = 'user/UPDATE_REQUEST_FAILURE';

const DACO_CHECK_REQUEST = 'user/DACO_CHECK_REQUEST';
const DACO_CHECK_SUCCESS = 'user/DACO_CHECK_SUCCESS';
const DACO_CHECK_FAILURE = 'user/DACO_CHECK_FAILURE';
const REMOVE_EMAIL = 'user/REMOVE_EMAIL';
const TOGGLE_MODAL = 'user/TOGGLE_MODAL';
const RESET_ENROLMENT_FORM = 'user/RESET_ENROLMENT_FORM';

const RF_NEXT_STEP = 'userRequestForm/NEXT_STEP';
const RF_PREVIOUS_STEP = 'userRequestForm/PREVIOUS_STEP';
const RF_RESET_FORM_STEP = 'userRequestForm/RESET_FORM_STEP';
const RF_TOGGLE_MODAL = 'userRequestForm/TOGGLE_MODAL';

const fetchRequestsStart = emptyActionGenerator(FETCH_REQUESTS_REQUEST);
const fetchRequestsSuccess = payloadActionGenerator(FETCH_REQUESTS_SUCCESS);
const fetchRequestsError = payloadActionGenerator(FETCH_REQUESTS_FAILURE);

const dacoCheckStart = emptyActionGenerator(DACO_CHECK_REQUEST);
const dacoCheckSuccess = payloadActionGenerator(DACO_CHECK_SUCCESS);
const dacoCheckError = payloadActionGenerator(DACO_CHECK_FAILURE);

const enrollUsersStart = emptyActionGenerator(ENROLL_USERS_REQUEST);
const enrollUsersSuccess = payloadActionGenerator(ENROLL_USERS_SUCCESS);
const enrollUsersError = payloadActionGenerator(ENROLL_USERS_FAILURE);

const submitUserStart = emptyActionGenerator(SUBMIT_USER_REQUEST);
const submitUserSuccess = payloadActionGenerator(SUBMIT_USER_SUCCESS);
const submitUserError = payloadActionGenerator(SUBMIT_USER_FAILURE);

const updateUserRequestStart = payloadActionGenerator(UPDATE_REQUEST_REQUEST);
const updateUserRequestSuccess = payloadActionGenerator(UPDATE_REQUEST_SUCCESS);
const updateUserRequestError = payloadActionGenerator(UPDATE_REQUEST_FAILURE);

/*
* Public actions
*/

export const toggleModal = emptyActionGenerator(TOGGLE_MODAL);
export const removeEmail = payloadActionGenerator(REMOVE_EMAIL);
export const resetEnrolmentForm = emptyActionGenerator(RESET_ENROLMENT_FORM);

export const rfNextStep = emptyActionGenerator(RF_NEXT_STEP);
export const rfPrevStep = emptyActionGenerator(RF_PREVIOUS_STEP);
export const rfResetStep = emptyActionGenerator(RF_RESET_FORM_STEP);
export const rfToggleModal = emptyActionGenerator(RF_TOGGLE_MODAL);

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

export function submitUserApplication(dispatch, projectId, data, next = () => null) {
  const userData = {
    ...data,
    project: projectId,
    status: 0,
  };

  dispatch(submitUserStart());

  return asyncServices.user
    .submit(projectId, userData)
    .then(response => {
      dispatch(submitUserSuccess('User request submitted!'));
      next();
    })
    .catch(error => {
      dispatch(submitUserError(error));
    });
}

export function approveUserRequest(dispatch, projectId, id, next = () => null) {
  dispatch(updateUserRequestStart('Approve User Request'));

  return asyncServices.user
    .updateUserRequest(projectId, id, { status: 1 })
    .then(response => {
      dispatch(updateUserRequestSuccess('User Approved'));
      next();
    })
    .catch(error => {
      dispatch(updateUserRequestError(error));
    });
}

export function denyUserRequest(dispatch, projectId, id, next = () => null) {
  dispatch(updateUserRequestStart('Deny User Request'));

  return asyncServices.user
    .updateUserRequest(projectId, id, { status: 2 })
    .then(response => {
      dispatch(updateUserRequestSuccess('User Denied'));
      next();
    })
    .catch(error => {
      dispatch(updateUserRequestError(error));
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
        error: action.payload,
      };
    default:
      return state;
  }
};

// Enrolment Form Reducer
const _defaultUserEnrolmentFormState = {
  isFetching: false,
  submitSuccess: false,
  error: null,
  users: [],
};

export const userEnrolmentFormReducer = (state = _defaultUserEnrolmentFormState, action) => {
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
        error: null,
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
        ..._defaultUserEnrolmentFormState,
        show: true,
        submitSuccess: true,
        error: null,
      };
    case REMOVE_EMAIL: {
      const users = [...state.users];
      _.remove(users, e => e === action.payload);
      return {
        ...state,
        users,
        error: null,
      };
    }
    case TOGGLE_MODAL:
    case RESET_ENROLMENT_FORM:
      return {
        ..._defaultUserEnrolmentFormState,
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
        ..._defaultUserEnrolmentModalState,
        show: !state.show,
      };
    default:
      return state;
  }
};

// User Request Form UI
const _defaultRequestFormState = {
  step: 1,
  showModal: false,
  error: null,
};

export const requestFormReducer = (state = _defaultRequestFormState, action) => {
  switch (action.type) {
    case RF_NEXT_STEP:
      return { ...state, step: state.step + 1 };
    case RF_PREVIOUS_STEP:
      return { ...state, step: state.step - 1 };
    case RF_RESET_FORM_STEP:
      return { ...state, step: 1 };
    case RF_TOGGLE_MODAL:
      return { ...state, showModal: !state.showModal };
    case SUBMIT_USER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
