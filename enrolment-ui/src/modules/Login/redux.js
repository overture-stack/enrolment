import { emptyActionGenerator } from '../../redux/helpers';

/*
* Actions
*/
const CHANGE_LOGIN_GATEWAY = 'login/CHANGE_LOGIN_GATEWAY';

/*
* Public standard actions
*/

export const changeLoginGateway = emptyActionGenerator(CHANGE_LOGIN_GATEWAY);

/*
* Reducer
*/
const _defaultState = {
  isGoogleLogin: true,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case CHANGE_LOGIN_GATEWAY:
      return { ...state, isGoogleLogin: !state.isGoogleLogin };
    default:
      return state;
  }
};
