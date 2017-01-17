import { API_CALL_INFO } from '../middleware';

export const AUTHENTICATE_REQUEST = 'AUTHENTICATE_REQUEST';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_ERROR = 'AUTHENTICATE_ERROR';

export const AUTHORIZE_REQUEST = 'AUTHORIZE_REQUEST';
export const AUTHORIZE_SUCCESS = 'AUTHORIZE_SUCCESS';
export const AUTHORIZE_ERROR = 'AUTHORIZE_ERROR';

const LOGIN_URL = '/api/login';
const CONSENT_URL = 'api/consent';

// =================
// Authorization
// =================
export function authorizeRequest(params) {
  return {
    type: AUTHORIZE_REQUEST,
    params
  };
}

export function authorizeError(params) {
  return {
    type: AUTHORIZE_ERROR,
    params
  };
}

export function authorizeSuccess(response) {
  return dispatch => {
    dispatch({
      type: AUTHORIZE_SUCCESS,
      response
    });
  };
}

export function authorize(params) {
  return dispatch => {
    dispatch({
      [API_CALL_INFO]: {
        endpoint: CONSENT_URL,
        actionTypes: [AUTHORIZE_REQUEST, AUTHORIZE_SUCCESS, AUTHORIZE_ERROR],
        parameters: params
      }
    });
  };
}

// =================
// Authenticatation
// =================
export function authenticateRequest(params) {
  return {
    type: AUTHENTICATE_REQUEST,
    params
  };
}

export function authenticateError(params) {
  return {
    type: AUTHENTICATE_ERROR,
    params
  };
}

export function authenticateSuccess(response) {
  return dispatch => {
    dispatch({
      type: AUTHENTICATE_SUCCESS,
      response
    });
  }
}

export function authenticate(params) {
  return dispatch => {
    dispatch({
      [API_CALL_INFO]: {
        endpoint: LOGIN_URL,
        actionTypes: [AUTHENTICATE_REQUEST, AUTHENTICATE_SUCCESS, AUTHENTICATE_ERROR],
        parameters: params
      }
    });
  };
}
