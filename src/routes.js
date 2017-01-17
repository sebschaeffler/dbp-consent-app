import React from 'react';
import { IndexRoute, IndexRedirect, Route, RouterContext } from 'react-router';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import AppLayout from "./components/AppLayout";
import SignIn from "./modules/SignIn";
import Consent from "./modules/Consent";

// Redirects to / by default
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.signIn.parameters, // how to get the user state
  authenticatingSelector: state => state.signIn.isProcessing, // is it used??
  redirectAction: RouterContext.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'UserIsAuthenticated', // a nice name for this auth check
  predicate: parameters => parameters.id, // check if 'id' exists
  allowRedirectBack: false,
  failureRedirectPath: '/signin'
});

export default (
  <Route path="/" component={AppLayout}>
    <IndexRoute component={AppLayout} />
    <IndexRedirect to="signin" />
    <Route path="signin" component={SignIn} />
    <Route path="consent" component={UserIsAuthenticated(Consent)} />
  </Route>
);
