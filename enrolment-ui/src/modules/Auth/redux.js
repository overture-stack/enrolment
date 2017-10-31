import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';
import { fetchProfile, clearProfile } from '../Profile/redux';

/*
* Actions
*/
const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

const LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'auth/LOGOUT_FAILURE';

const loginStart = emptyActionGenerator(LOGIN_REQUEST);
const loginSuccess = emptyActionGenerator(LOGIN_SUCCESS);
const loginError = payloadActionGenerator(LOGIN_FAILURE);

const logoutStart = emptyActionGenerator(LOGOUT_REQUEST);
const logoutSuccess = emptyActionGenerator(LOGOUT_SUCCESS);
const logoutError = payloadActionGenerator(LOGOUT_FAILURE);

/*
* Private Composite Functions
*/
const onLoginSuccess = (dispatch, data) => {
  const next = () => dispatch(loginSuccess());
  fetchProfile(dispatch, true, next);
};

const onGoogleLoginSuccess = (dispatch, data) => {
  asyncServices.auth
    .googleSuccess({ access_token: data.accessToken })
    .then(() => asyncServices.auth.daco(data.profileObj))
    .then(response => {
      const next = () => dispatch(loginSuccess());
      fetchProfile(dispatch, false, next);
    })
    .catch(error => {
      dispatch(loginError(error));
    });
};

/*
* Public Composite Functions
*/

export function logout(dispatch) {
  dispatch(logoutStart());
  return asyncServices.auth
    .logout()
    .then(() => {
      dispatch(logoutSuccess());
      dispatch(clearProfile());
      window.sessionStorage.clear();
    })
    .catch(error => {
      dispatch(logoutError(error));
    });
}

/*
* Public async thunk actions (mapped to component props)
*/

// Login function used by InternalLoginForm submit
export function adminLogin(dispatch, data) {
  dispatch(loginStart());

  return asyncServices.auth
    .adminLogin(data)
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
  isLoggedIn: false,
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
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
    case LOGOUT_SUCCESS:
      return {
        ..._defaultState,
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
