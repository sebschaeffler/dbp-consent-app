import { Record } from 'immutable';
import { AUTHENTICATE_REQUEST, AUTHORIZE_REQUEST, AUTHORIZE_SUCCESS, AUTHORIZE_ERROR } from '../actions';

/**********************
 * State
 **********************/
const StateRecord = new Record({
  isProcessing: false,
  isAuthorized: false,
  code: ''
});

class State extends StateRecord {
}

const INITIAL_STATE = new State();

export default function (state = INITIAL_STATE, action) {
  console.log('Reducing: ', action);
  switch (action.type) {
    // Clean state in case of re-authentication of the user 
    case AUTHENTICATE_REQUEST:
      return state
        .set('isProcessing', false)
        .set('isAuthorized', false)
        .set('code', '');
    case AUTHORIZE_REQUEST:
      return state
        .set('isProcessing', true);
    case AUTHORIZE_SUCCESS:
      const { response } = action;
      return state
        .set('isProcessing', false)
        .set('isAuthorized', true)
        .set('code', response.code);
    case AUTHORIZE_ERROR:
      return state
        .set('isProcessing', false);
    default:
      return state;
  }
}
