import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const CHECK_USER_REQUEST_REQUEST = 'login/CHECK_USER_REQUEST_REQUEST';
const CHECK_USER_REQUEST_SUCCESS = 'login/CHECK_USER_REQUEST_SUCCESS';
const CHECK_USER_REQUEST_FAILURE = 'login/CHECK_USER_REQUEST_FAILURE';

const RESET = 'login/RESET';
const CHANGE_LOGIN_GATEWAY = 'login/CHANGE_LOGIN_GATEWAY';

const checkUserRequestStart = emptyActionGenerator(CHECK_USER_REQUEST_REQUEST);
const checkUserRequestSuccess = emptyActionGenerator(CHECK_USER_REQUEST_SUCCESS);
const checkUserRequestError = payloadActionGenerator(CHECK_USER_REQUEST_FAILURE);

/*
* Public standard actions
*/

export const changeLoginGateway = emptyActionGenerator(CHANGE_LOGIN_GATEWAY);
export const resetLoginState = emptyActionGenerator(RESET);

/*
* Public async thunk actions (mapped to component props)
*/

/**
 * Populates profile in state
 * @param {Function} dispatch - standard dispatch passthrough
 * @param {boolean} isAdmin - admin login vs google login
 */
export function checkUserRequest(dispatch, id) {
  dispatch(checkUserRequestStart());

  return asyncServices.user
    .checkUserRequest(id)
    .then(response => {
      dispatch(checkUserRequestSuccess());
    })
    .catch(error => {
      dispatch(checkUserRequestError(error));
    });
}

/*
* Reducer
*/
const _defaultState = {
  loading: false,
  isGoogleLogin: true,
  isUserRequestValid: true,
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case CHECK_USER_REQUEST_REQUEST:
      return { ...state, loading: true, error: null };
    case CHECK_USER_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        isUserRequestValid: true,
        error: null,
      };
    case CHECK_USER_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        isUserRequestValid: false,
        error: action.payload,
      };
    case CHANGE_LOGIN_GATEWAY:
      return { ...state, isGoogleLogin: !state.isGoogleLogin };
    case RESET:
      return { ..._defaultState };
    default:
      return state;
  }
};
