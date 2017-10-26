import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_PROJECTS_REQUEST = 'project/FETCH_PROJECTS_REQUEST';
const FETCH_PROJECTS_SUCCESS = 'project/FETCH_PROJECTS_SUCCESS';
const FETCH_PROJECTS_FAILURE = 'project/FETCH_PROJECTS_FAILURE';

const NEXT_STEP = 'projectRequestForm/NEXT_STEP';
const PREVIOUS_STEP = 'projectRequestForm/PREVIOUS_STEP';

const fetchProjectsStart = emptyActionGenerator(FETCH_PROJECTS_REQUEST);
const fetchProjectsSuccess = payloadActionGenerator(FETCH_PROJECTS_SUCCESS);
const fetchProjectsError = payloadActionGenerator(FETCH_PROJECTS_FAILURE);

/*
* Public actions for dispatch
*/

export const formNextStep = emptyActionGenerator(NEXT_STEP);
export const formPrevStep = emptyActionGenerator(PREVIOUS_STEP);

/*
* Public async thunk actions (mapped to component props)
*/

export function fetchProjects(dispatch) {
  dispatch(fetchProjectsStart());

  return asyncServices.project
    .fetchProjects()
    .then(response => {
      dispatch(fetchProjectsSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchProjectsError(error));
    });
}

// TEMP
export function submitProjectApplication(dispatch, data) {
  console.log(data);
  console.log('Application Submitted');
}

/*
* Reducers
*/
const _defaultState = {
  loading: false,
  hasProjects: false,
  data: [],
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        hasProjects: true,
        data: [],
        error: null,
      };
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        hasProjects: false,
        data: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

const _defaultRequestFormState = {
  step: 1,
};

export const requestFormReducer = (state = _defaultRequestFormState, action) => {
  switch (action.type) {
    case NEXT_STEP:
      return { ...state, step: state.step + 1 };
    case PREVIOUS_STEP:
      return { ...state, step: state.step - 1 };
    default:
      return state;
  }
};
