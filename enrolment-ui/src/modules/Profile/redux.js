import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_PROFILE_REQUEST = 'profile/FETCH_PROFILE_REQUEST';
const FETCH_PROFILE_SUCCESS = 'profile/FETCH_PROFILE_SUCCESS';
const FETCH_PROFILE_FAILURE = 'profile/FETCH_PROFILE_FAILURE';

const fetchProfileStart = emptyActionGenerator(FETCH_PROFILE_REQUEST);
const fetchProfileSuccess = payloadActionGenerator(FETCH_PROFILE_SUCCESS);
const fetchProfileError = payloadActionGenerator(FETCH_PROFILE_FAILURE);

/*
* Public async thunk actions (mapped to component props)
*/

export function fetchProfile(dispatch) {
  dispatch(fetchProfileStart());

  return asyncServices.profile
    .getUser()
    .then(response => {
      dispatch(fetchProfileSuccess(response.data));
    })
    .catch(error => {
      dispatch(fetchProfileError(error));
    });
}

/*
* Reducer
*/
const _defaultState = {
  loading: false,
  hasProfile: false,
  data: null,
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        hasProfile: true,
        data: action.payload,
        error: null,
      };
    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        hasProfile: false,
        data: null,
        error: action.payload,
      };
    default:
      return state;
  }
};
