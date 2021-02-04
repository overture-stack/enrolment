import { emptyActionGenerator, payloadActionGenerator } from '../../redux/helpers';
import asyncServices from '../../services';

/*
* Actions
*/
const GET_FEES_REQUEST = 'fees/GET_FEES_REQUEST';
const GET_FEES_SUCCESS = 'fees/GET_FEES_SUCCESS';
const GET_FEES_FAILURE = 'fees/GET_FEES_FAILURE';

const getFeesStart = emptyActionGenerator(GET_FEES_REQUEST);
const getFeesSuccess = payloadActionGenerator(GET_FEES_SUCCESS);
const getFeesError = payloadActionGenerator(GET_FEES_FAILURE);

/*
* Public async thunk actions (mapped to component props)
*/

export function getFees(dispatch) {
  dispatch(getFeesStart());

  return asyncServices.billing
    .getPrice()
    .then(response => {
      dispatch(getFeesSuccess(response.data));
    })
    .catch(error => {
      dispatch(getFeesError(error));
    });
}

/*
* Reducer
*/
const _defaultState = {
  loading: true,
  data: null,
  error: null,
};

export const reducer = (state = _defaultState, action) => {
  switch (action.type) {
    case GET_FEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_FEES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case GET_FEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
