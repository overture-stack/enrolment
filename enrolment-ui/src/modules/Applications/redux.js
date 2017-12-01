import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';
import { fetchOneProject } from '../Projects/redux';

/*
* Actions
*/
const FETCH_APPLICATIONS_REQUEST = 'application/FETCH_APPLICATIONS_REQUEST';
const FETCH_APPLICATIONS_SUCCESS = 'application/FETCH_APPLICATIONS_SUCCESS';
const FETCH_APPLICATIONS_FAILURE = 'application/FETCH_APPLICATIONS_FAILURE';

const FETCH_ONE_APPLICATION_REQUEST = 'application/FETCH_ONE_APPLICATION_REQUEST';
const FETCH_ONE_APPLICATION_SUCCESS = 'application/FETCH_ONE_APPLICATION_SUCCESS';
const FETCH_ONE_APPLICATION_FAILURE = 'application/FETCH_ONE_APPLICATION_FAILURE';

const SUBMIT_APPLICATION_REQUEST = 'application/SUBMIT_APPLICATION_REQUEST';
const SUBMIT_APPLICATION_SUCCESS = 'application/SUBMIT_APPLICATION_SUCCESS';
const SUBMIT_APPLICATION_FAILURE = 'application/SUBMIT_APPLICATION_FAILURE';

const fetchApplicationsStart = emptyActionGenerator(FETCH_APPLICATIONS_REQUEST);
const fetchApplicationsSuccess = payloadActionGenerator(FETCH_APPLICATIONS_SUCCESS);
const fetchApplicationsError = payloadActionGenerator(FETCH_APPLICATIONS_FAILURE);

const fetchOneApplicationStart = emptyActionGenerator(FETCH_ONE_APPLICATION_REQUEST);
const fetchOneApplicationSuccess = payloadActionGenerator(FETCH_ONE_APPLICATION_SUCCESS);
const fetchOneApplicationError = payloadActionGenerator(FETCH_ONE_APPLICATION_FAILURE);

const submitApplicationStart = emptyActionGenerator(SUBMIT_APPLICATION_REQUEST);
const submitApplicationSuccess = payloadActionGenerator(SUBMIT_APPLICATION_SUCCESS);
const submitApplicationError = payloadActionGenerator(SUBMIT_APPLICATION_FAILURE);

/*
* Public async thunk actions (mapped to component props)
*/
export function fetchApplications(dispatch) {
  dispatch(fetchApplicationsStart());

  return asyncServices.application
    .fetchApplications()
    .then(response => {
      dispatch(fetchApplicationsSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchApplicationsError(error));
    });
}

export function fetchOneApplication(dispatch, id) {
  dispatch(fetchOneApplicationStart());

  return asyncServices.application
    .fetchApplication(id)
    .then(response => {
      dispatch(fetchOneApplicationSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchOneApplicationError(error));
    });
}

export function fetchApplicationAndProject(dispatch, applicationId) {
  dispatch(fetchOneApplicationStart());

  return asyncServices.application
    .fetchApplication(applicationId)
    .then(response => {
      dispatch(fetchOneApplicationSuccess(response.data));
      fetchOneProject(dispatch, response.data.project);
    })
    .catch(error => {
      dispatch(fetchOneApplicationError(error));
    });
}

export function submitApplication(dispatch, data, next = () => null) {
  dispatch(submitApplicationStart());

  return asyncServices.application
    .submit(data)
    .then(response => {
      dispatch(submitApplicationSuccess(response.data));
      next();
    })
    .catch(error => {
      dispatch(submitApplicationError(error));
    });
}

/*
* Reducer
*/

// Applications
const _defaultState = {
  loading: true,
  hasApplications: false,
  data: [],
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case FETCH_APPLICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_APPLICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        hasApplications: true,
        data: action.payload,
      };
    case FETCH_APPLICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        hasApplications: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Single Application
const _defaultApplicationState = {
  loading: true,
  data: null,
  error: null,
  hasFetched: false,
};

export const applicationReducer = (state = _defaultApplicationState, action) => {
  switch (action.type) {
    case SUBMIT_APPLICATION_REQUEST:
    case FETCH_ONE_APPLICATION_REQUEST:
      return {
        ...state,
        loading: true,
        data: null,
        error: null,
        hasFetched: false,
      };
    case SUBMIT_APPLICATION_SUCCESS:
    case FETCH_ONE_APPLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
        hasFetched: true,
      };
    case SUBMIT_APPLICATION_FAILURE:
    case FETCH_ONE_APPLICATION_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
        hasFetched: true,
      };
    default:
      return state;
  }
};
