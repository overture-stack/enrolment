import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

import { submitApplication } from '../Applications/redux';

/*
* Actions
*/
const FETCH_PROJECTS_REQUEST = 'project/FETCH_PROJECTS_REQUEST';
const FETCH_PROJECTS_SUCCESS = 'project/FETCH_PROJECTS_SUCCESS';
const FETCH_PROJECTS_FAILURE = 'project/FETCH_PROJECTS_FAILURE';

// const FETCH_ONE_PROJECT_REQUEST = 'project/FETCH_ONE_PROJECT_REQUEST';
// const FETCH_ONE_PROJECT_SUCCESS = 'project/FETCH_ONE_PROJECT_SUCCESS';
// const FETCH_ONE_PROJECT_FAILURE = 'project/FETCH_ONE_PROJECT_FAILURE';

const SUBMIT_PROJECT_REQUEST = 'project/SUBMIT_PROJECT_REQUEST';
const SUBMIT_PROJECT_SUCCESS = 'project/SUBMIT_PROJECT_SUCCESS';
const SUBMIT_PROJECT_FAILURE = 'project/SUBMIT_PROJECT_FAILURE';

const NEXT_STEP = 'projectRequestForm/NEXT_STEP';
const PREVIOUS_STEP = 'projectRequestForm/PREVIOUS_STEP';
const TOGGLE_MODAL = 'projectRequestForm/TOGGLE_MODAL';

const fetchProjectsStart = emptyActionGenerator(FETCH_PROJECTS_REQUEST);
const fetchProjectsSuccess = payloadActionGenerator(FETCH_PROJECTS_SUCCESS);
const fetchProjectsError = payloadActionGenerator(FETCH_PROJECTS_FAILURE);

// const fetchOneProjectStart = emptyActionGenerator(FETCH_ONE_PROJECT_REQUEST);
// const fetchOneProjectSuccess = payloadActionGenerator(FETCH_ONE_PROJECT_SUCCESS);
// const fetchOneProjectError = payloadActionGenerator(FETCH_ONE_PROJECT_FAILURE);

const submitProjectStart = emptyActionGenerator(SUBMIT_PROJECT_REQUEST);
const submitProjectSuccess = payloadActionGenerator(SUBMIT_PROJECT_SUCCESS);
const submitProjectError = payloadActionGenerator(SUBMIT_PROJECT_FAILURE);

/*
* Public actions for dispatch
*/

export const formNextStep = emptyActionGenerator(NEXT_STEP);
export const formPrevStep = emptyActionGenerator(PREVIOUS_STEP);
export const toggleFormModal = emptyActionGenerator(TOGGLE_MODAL);

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

export function submitProjectApplication(dispatch, data) {
  const projectData = {
    user: data.user,
    project_name: data.project_name,
    project_description: data.project_description,
    pi: `${data.firstname} ${data.lastname}`,
    status: 0,
  };

  dispatch(submitProjectStart());

  return asyncServices.project
    .submit(projectData)
    .then(response => {
      const applicationData = {
        project: response.data.id,
        daco_email: data.daco_email,
        user: data.user,
        firstname: data.firstname,
        lastname: data.lastname,
        position: data.position,
        address: data.address,
        institution_name: data.institution_name,
        institution_email: data.institution_email,
        agreementCheck: data.agreementCheck,
      };

      dispatch(submitProjectSuccess(response.data));

      // Dispatch Application submit with next function that shows the modal
      submitApplication(dispatch, applicationData, () => dispatch(toggleFormModal()));
    })
    .catch(error => {
      dispatch(submitProjectError(error));
    });
}

/*
* Reducers
*/

// Projects
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
        data: action.payload,
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

// Single Project
const _defaultProjectState = {
  loading: false,
  data: null,
  error: null,
};

export const projectReducer = (state = _defaultProjectState, action) => {
  switch (action.type) {
    case SUBMIT_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SUBMIT_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case SUBMIT_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Project Form UI
const _defaultRequestFormState = {
  step: 1,
  showModal: false,
};

export const requestFormReducer = (state = _defaultRequestFormState, action) => {
  switch (action.type) {
    case NEXT_STEP:
      return { ...state, step: state.step + 1 };
    case PREVIOUS_STEP:
      return { ...state, step: state.step - 1 };
    case TOGGLE_MODAL:
      return {
        ...state,
        showModal: !state.showModal,
      };
    default:
      return state;
  }
};
