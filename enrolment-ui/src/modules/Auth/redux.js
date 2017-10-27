import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';
import { fetchProfile } from '../Profile/redux';

/*
* Actions
*/
const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
const LOGOUT = 'auth/LOGOUT';

const loginStart = emptyActionGenerator(LOGIN_REQUEST);
const loginSuccess = emptyActionGenerator(LOGIN_SUCCESS);
const loginError = payloadActionGenerator(LOGIN_FAILURE);
const logoutAction = emptyActionGenerator(LOGOUT);

/*
* Private Composite Functions
*/
const onLoginSuccess = (dispatch, data) => {
  fetchProfile(dispatch, true);
  dispatch(loginSuccess());
};

const onGoogleLoginSuccess = (dispatch, data) => {
  asyncServices.auth
    .googleSuccess({ access_token: data.accessToken })
    .then(() => asyncServices.auth.daco(data.profileObj))
    .then(response => {
      fetchProfile(dispatch, false);
      dispatch(loginSuccess());
    })
    .catch(error => {
      dispatch(loginError(error));
    });
};

/*
* Public Composite Functions
*/

export function logout(dispatch) {
  dispatch(logoutAction());
  // TODO - All logout related stuff here
}

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
      onGoogleLoginSuccess(dispatch, response);
    },
    onFailure: error => dispatch(loginError(error)),
  };
}

/*
* Reducer
*/
const _defaultState = {
  loading: false,
  isLoggedIn: true,
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
    case LOGOUT:
      return {
        ..._defaultState,
      };
    default:
      return state;
  }
};
