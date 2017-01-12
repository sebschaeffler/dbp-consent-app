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
        <footer><a target="blank" href="#">Consent App 0.1</a></footer>
      </div>
    );
  }
}
