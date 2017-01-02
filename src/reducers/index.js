import { combineReducers } from 'redux';
import SignInReducer from './signin_reducer';
import ConsentReducer from './consent_reducer';

const rootReducer = combineReducers({
  signIn: SignInReducer,
  consent: ConsentReducer
});

export default rootReducer;
