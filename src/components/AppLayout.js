// @flow
import React, { Component } from 'react';

export default class AppLayout extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <br /><br />
        Consent App 0.1 Alpha
        <br /><br />
        {this.props.children}
      </div>
    );
  }
}
