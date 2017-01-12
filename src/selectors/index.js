export const isProcessing = (state) => state.signIn.isProcessing;
export const getParameters = (state) => { return state.signIn.parameters };
export const isAuthenticated = (state) => state.signIn.isAuthenticated;
export const isAuthorized = (state) => state.consent.isAuthorized;
export const getCode = (state) => state.consent.code;
export const getSignInError = (state) => state.signIn.error;
export const getConsentError = (state) => state.consent.error;
