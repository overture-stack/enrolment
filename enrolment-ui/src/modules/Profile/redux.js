import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const FETCH_PROFILE_REQUEST = 'profile/FETCH_PROFILE_REQUEST';
const FETCH_PROFILE_SUCCESS = 'profile/FETCH_PROFILE_SUCCESS';
const FETCH_PROFILE_FAILURE = 'profile/FETCH_PROFILE_FAILURE';
const CLEAR_PROFILE = 'profile/CLEAR_PROFILE';

const fetchProfileStart = emptyActionGenerator(FETCH_PROFILE_REQUEST);
const fetchProfileSuccess = payloadActionGenerator(FETCH_PROFILE_SUCCESS);
const fetchProfileError = payloadActionGenerator(FETCH_PROFILE_FAILURE);

/*
* Private internal functions
*/
const getAdminProfile = () => {
  return new Promise((resolve, reject) => {
    asyncServices.profile
      .getUser()
      .then(response => {
        resolve({
          ...response,
          data: {
            ...response.data,
            social: {
              name: 'Admin',
              picture: 'http://www.iconninja.com/files/538/231/811/admin-icon.png',
            },
          },
        });
      })
      .catch(error => reject(error));
  });
};

const getUserProfile = () => {
  const { getUser, getSocial } = asyncServices.profile;

  return new Promise((resolve, reject) => {
    Promise.all([getUser(), getSocial()])
      .then(response =>
        resolve({
          ...response[0],
          data: {
            ...response[0].data,
            social: response[1].data,
          },
        }),
      )
      .catch(error => reject(error));
  });
};

/*
* Public Functions
*/
export const clearProfile = emptyActionGenerator(CLEAR_PROFILE);

/*
* Public async thunk actions (mapped to component props)
*/

/**
 * Populates profile in state
 * @param {Function} dispatch - standard dispatch passthrough
 * @param {boolean} isAdmin - admin login vs google login
 */
export function fetchProfile(dispatch, isAdmin, next = () => null) {
  dispatch(fetchProfileStart());

  const getProfile = isAdmin ? getAdminProfile : getUserProfile;

  return getProfile()
    .then(response => {
      dispatch(fetchProfileSuccess(response.data));
      next();
    })
    .catch(error => {
      dispatch(fetchProfileError(error));
    });
}

/*
* Reducer
*/
const _defaultState = {
  loading: true,
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
    case CLEAR_PROFILE:
      return _defaultState;
    default:
      return state;
  }
};
