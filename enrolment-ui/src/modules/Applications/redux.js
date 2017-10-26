import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_APPLICATIONS_REQUEST = 'application/FETCH_APPLICATIONS_REQUEST';
const FETCH_APPLICATIONS_SUCCESS = 'application/FETCH_APPLICATIONS_SUCCESS';
const FETCH_APPLICATIONS_FAILURE = 'application/FETCH_APPLICATIONS_FAILURE';

const FETCH_ONE_APPLICATION_REQUEST = 'application/FETCH_ONE_APPLICATION_REQUEST';
const FETCH_ONE_APPLICATION_SUCCESS = 'application/FETCH_ONE_APPLICATION_SUCCESS';
const FETCH_ONE_APPLICATION_FAILURE = 'application/FETCH_ONE_APPLICATION_FAILURE';

const fetchApplicationsStart = emptyActionGenerator(FETCH_APPLICATIONS_REQUEST);
const fetchApplicationsSuccess = payloadActionGenerator(FETCH_APPLICATIONS_SUCCESS);
const fetchApplicationsError = payloadActionGenerator(FETCH_APPLICATIONS_FAILURE);

const fetchOneApplicationStart = emptyActionGenerator(FETCH_ONE_APPLICATION_REQUEST);
const fetchOneApplicationSuccess = payloadActionGenerator(FETCH_ONE_APPLICATION_SUCCESS);
const fetchOneApplicationError = payloadActionGenerator(FETCH_ONE_APPLICATION_FAILURE);

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

/*
* Reducer
*/
const _defaultState = {
  loading: false,
  application: null,
  applications: [],
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case FETCH_APPLICATIONS_REQUEST:
    case FETCH_ONE_APPLICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_APPLICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: action.payload,
      };
    case FETCH_ONE_APPLICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        application: action.payload,
      };
    case FETCH_APPLICATIONS_FAILURE:
    case FETCH_ONE_APPLICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
