import _ from 'lodash';
import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/

const FETCH_PROJECT_USERS_REQUEST = 'projectUsers/FETCH_PROJECT_USERS_REQUEST';
const FETCH_PROJECT_USERS_SUCCESS = 'projectUsers/FETCH_PROJECT_USERS_SUCCESS';
const FETCH_PROJECT_USERS_FAILURE = 'projectUsers/FETCH_PROJECT_USERS_FAILURE';

const CREATE_USERS_REQUEST = 'projectUsers/CREATE_USERS_REQUEST';
const CREATE_USERS_SUCCESS = 'projectUsers/CREATE_USERS_SUCCESS';
const CREATE_USERS_FAILURE = 'projectUsers/CREATE_USERS_FAILURE';

const UPDATE_REQUEST_REQUEST = 'projectUsers/UPDATE_REQUEST_REQUEST';
const UPDATE_REQUEST_SUCCESS = 'projectUsers/UPDATE_REQUEST_SUCCESS';
const UPDATE_REQUEST_FAILURE = 'projectUsers/UPDATE_REQUEST_FAILURE';

const FETCH_ONE_REQUEST = 'projectUsers/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS = 'projectUsers/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE = 'projectUsers/FETCH_ONE_FAILURE';

const DACO_CHECK_REQUEST = 'projectUsers/DACO_CHECK_REQUEST';
const DACO_CHECK_SUCCESS = 'projectUsers/DACO_CHECK_SUCCESS';
const DACO_CHECK_FAILURE = 'projectUsers/DACO_CHECK_FAILURE';
const REMOVE_EMAIL = 'projectUsers/REMOVE_EMAIL';
const TOGGLE_MODAL = 'projectUsers/TOGGLE_MODAL';
const RESET_ENROLMENT_FORM = 'projectUsers/RESET_ENROLMENT_FORM';

const RF_NEXT_STEP = 'userRequestForm/NEXT_STEP';
const RF_PREVIOUS_STEP = 'userRequestForm/PREVIOUS_STEP';
const RF_RESET_FORM_STEP = 'userRequestForm/RESET_FORM_STEP';
const RF_TOGGLE_MODAL = 'userRequestForm/TOGGLE_MODAL';

const fetchProjectUsersStart = emptyActionGenerator(FETCH_PROJECT_USERS_REQUEST);
const fetchProjectUsersSuccess = payloadActionGenerator(FETCH_PROJECT_USERS_SUCCESS);
const fetchProjectUsersError = payloadActionGenerator(FETCH_PROJECT_USERS_FAILURE);

const fetchOneUserStart = emptyActionGenerator(FETCH_ONE_REQUEST);
const fetchOneUserSuccess = payloadActionGenerator(FETCH_ONE_SUCCESS);
const fetchOneUserError = payloadActionGenerator(FETCH_ONE_FAILURE);

const dacoCheckStart = emptyActionGenerator(DACO_CHECK_REQUEST);
const dacoCheckSuccess = payloadActionGenerator(DACO_CHECK_SUCCESS);
const dacoCheckError = payloadActionGenerator(DACO_CHECK_FAILURE);

const createlUsersStart = emptyActionGenerator(CREATE_USERS_REQUEST);
const createlUsersSuccess = payloadActionGenerator(CREATE_USERS_SUCCESS);
const createlUsersError = payloadActionGenerator(CREATE_USERS_FAILURE);

const updateProjectUserStart = payloadActionGenerator(UPDATE_REQUEST_REQUEST);
const updateProjectUserSuccess = payloadActionGenerator(UPDATE_REQUEST_SUCCESS);
const updateProjectUserError = payloadActionGenerator(UPDATE_REQUEST_FAILURE);

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

export function fetchAllProjectUsers(dispatch) {
  dispatch(fetchProjectUsersStart());

  return asyncServices.projectUsers
    .fetchAll()
    .then(response => {
      dispatch(fetchProjectUsersSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchProjectUsersError(error));
    });
}

export function fetchProjectUsersByProjectId(dispatch, projectId) {
  dispatch(fetchProjectUsersStart());

  return asyncServices.projectUsers
    .fetchByProjectId(projectId)
    .then(response => {
      dispatch(fetchProjectUsersSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchProjectUsersError(error));
    });
}

export function fetchOneProjectUser(dispatch, projectId, id) {
  dispatch(fetchOneUserStart());

  return asyncServices.projectUsers
    .fetchOneProjectUser(projectId, id)
    .then(response => {
      dispatch(fetchOneUserSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchOneUserError(error));
    });
}

export function createProjectUsers(dispatch, projectId, data, next = () => null) {
  dispatch(createlUsersStart());

  return asyncServices.projectUsers
    .create(projectId, data)
    .then(response => {
      dispatch(createlUsersSuccess(response.data));
      next();
    })
    .catch(error => {
      dispatch(createlUsersError(error));
    });
}

export function updateProjectUser(dispatch, projectId, id, data, next = () => null) {
  const userData = {
    ...data,
    status: 1,
  };

  dispatch(updateProjectUserStart());

  return asyncServices.projectUsers
    .update(projectId, id, userData)
    .then(response => {
      dispatch(updateProjectUserSuccess('Project User Application Updated!'));
      next();
    })
    .catch(error => {
      dispatch(updateProjectUserError(error));
    });
}

export function activateProjectUser(dispatch, projectId, id, next = () => null) {
  dispatch(updateProjectUserStart('Activate Project User Request'));

  return asyncServices.projectUsers
    .update(projectId, id, { status: 2 })
    .then(response => {
      dispatch(updateProjectUserSuccess('Project User Activated'));
      next();
    })
    .catch(error => {
      dispatch(updateProjectUserError(error));
    });
}

export function dacoCheck(dispatch, email) {
  dispatch(dacoCheckStart());

  return asyncServices.daco
    .check(email)
    .then(response => {
      dispatch(dacoCheckSuccess(email));
    })
    .catch(error => {
      dispatch(dacoCheckError(error));
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
    case FETCH_PROJECT_USERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_PROJECT_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        hasProjectUsers: action.payload.length > 0,
        data: action.payload,
        error: null,
      };
    case FETCH_PROJECT_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        hasProjectUsers: false,
        error: action.payload,
      };
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
      return {
        ...state,
        loading: true,
        hasFetched: false,
      };
    case FETCH_ONE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
        hasFetched: true,
      };
    case FETCH_ONE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        hasFetched: true,
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
    case CREATE_USERS_REQUEST:
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
    case CREATE_USERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case CREATE_USERS_SUCCESS:
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
    case UPDATE_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
