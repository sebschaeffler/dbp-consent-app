import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { Router, browserHistory } from 'react-router';
import routes from '../routes';
import configureStore from '../store';

const initialState = {};
const store = configureStore(initialState);

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
      </Provider>
    );
  }

}

export default App;
