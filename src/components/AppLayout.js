// @flow
import React, {Component} from 'react';
import {Image} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export default class AppLayout extends Component {
  render() {
    return (
      <div>
        <div className='header'>
          <Image className="logo" src={require('../../assets/dbglogo.png')} />
          <span className='header-title'>Digital Business Platform</span>
        </div>
        <div className="main_title_div">
          <FontAwesome name="lock"/><span className="main_title">Authorization flow</span>
        </div>
        {this.props.children}
        <div className="footer-div">
          <span className="footer-title">© 2017 Deutsche Börse</span>
        </div>
      </div>
    );
  }
}
