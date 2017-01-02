import { Record } from 'immutable';
import { AUTHENTICATE_REQUEST, AUTHENTICATE_SUCCESS, AUTHENTICATE_ERROR } from '../actions';

/**********************
 * Parameters
 **********************/
const ParameterRecord = new Record({
  id: null,
  password: null
});

class Parameters extends ParameterRecord {
}

/**********************
 * State
 **********************/
const StateRecord = new Record({
  isProcessing: false,
  isAuthenticated: false,
  parameters: new Parameters()
});

class State extends StateRecord {
}

const INITIAL_STATE = new State();

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTHENTICATE_REQUEST:
      return state.set('isProcessing', true);
    case AUTHENTICATE_SUCCESS:
      //console.log('Action: ', action);
      const { parameters } = action;
      return state
        .set('isProcessing', false)
        .set('isAuthenticated', true)
        .update('parameters', (params) =>
          parameters
        );
    case AUTHENTICATE_ERROR:
      return state.set('isProcessing', false);
    default:
      return state;
  }
}
