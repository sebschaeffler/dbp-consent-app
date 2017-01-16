// @flow
import React, { Component } from 'react';

export default class AppLayout extends Component {
  render() {
    return (
      <div>
        {/*<div className="main_title">
          Consent App 0.1 Alpha
        </div>*/}
        {this.props.children}
        <footer>Digital Business Platform - Consent App - 2017</footer>
      </div>
    );
  }
}
