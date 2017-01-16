import { Record } from 'immutable';
import { AUTHENTICATE_REQUEST, AUTHENTICATE_SUCCESS, AUTHENTICATE_ERROR } from '../actions';

/**********************
 * Parameters
 **********************/
const ParameterRecord = new Record({
  id: null,
  password: null,
  challenge: null,
  decodedChallenge: null
});

class Parameters extends ParameterRecord {
}

/**********************
 * State
 **********************/
const StateRecord = new Record({
  isProcessing: false,
  isAuthenticated: false,
  parameters: new Parameters(),
  error: null
});

class State extends StateRecord {
}

const INITIAL_STATE = new State();

export default function (state = INITIAL_STATE, action) {
  //console.log('Reducing: ', action);
  switch (action.type) {
    case AUTHENTICATE_REQUEST:
      return state.set('isProcessing', true)
        .set('error', null);
    case AUTHENTICATE_SUCCESS:
      const { response } = action;
      return state
        .set('isProcessing', false)
        .set('isAuthenticated', true)
        .update('parameters', (params) =>
          response
        )
        .set('error', null);
    case AUTHENTICATE_ERROR:
      const { errorMessage } = action;
      return state.set('isProcessing', false)
        .set('error', errorMessage.error);
    default:
      return state;
  }
}
