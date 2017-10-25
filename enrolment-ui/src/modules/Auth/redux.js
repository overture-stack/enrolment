import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

const loginStart = emptyActionGenerator(LOGIN_REQUEST);
const loginSuccess = emptyActionGenerator(LOGIN_SUCCESS);
const loginError = payloadActionGenerator(LOGIN_FAILURE);

/*
* Private Composite Functions
*/
const onLoginSuccess = (dispatch, data) => {
  // TODO Get profile and dispatch via profile reducer
  dispatch(loginSuccess());
};

/*
* Public async thunk actions (mapped to component props)
*/

// Login function used by InternalLoginForm submit
export function adminLogin(dispatch) {
  dispatch(loginStart());

  return asyncServices.auth
    .adminLogin()
    .then(response => {
      onLoginSuccess(dispatch, response);
    })
    .catch(error => {
      dispatch(loginError(error));
    });
}

// Login functions used by GoogleLogin component
export function createGoogleLoginFunctions(dispatch) {
  return {
    onRequest: () => dispatch(loginStart()),
    onSuccess: response => {
      onLoginSuccess(dispatch, response);
    },
    onFailure: error => dispatch(loginError(error)),
  };
}

/*
* Reducer
*/
const _defaultState = {
  isFetching: false,
  isLoggedIn: false,
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
