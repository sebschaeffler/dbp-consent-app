import { applyMiddleware, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import { isProduction } from '../../config/env';
import rootReducer from '../reducers';
import Api from '../middleware';

const middlewares = [ReduxThunk, Api];

export default (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );

  if (!isProduction()) {
    if (module.hot) {
      module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers');
        store.replaceReducer(nextRootReducer);
      });
    }
  }

  return store;
}
