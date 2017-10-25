import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_PROJECTS_REQUEST = 'project/FETCH_PROJECTS_REQUEST';
const FETCH_PROJECTS_SUCCESS = 'project/FETCH_PROJECTS_SUCCESS';
const FETCH_PROJECTS_FAILURE = 'project/FETCH_PROJECTS_FAILURE';

const fetchProjectsStart = emptyActionGenerator(FETCH_PROJECTS_REQUEST);
const fetchProjectsSuccess = payloadActionGenerator(FETCH_PROJECTS_SUCCESS);
const fetchProjectsError = payloadActionGenerator(FETCH_PROJECTS_FAILURE);

/*
* Public async thunk actions (mapped to component props)
*/

// Login function used by InternalLoginForm submit
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

/*
* Reducer
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
