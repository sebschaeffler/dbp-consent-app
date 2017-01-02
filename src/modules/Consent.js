import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authorize } from '../actions';
import { getParameters, isAuthorized, getCode } from '../selectors';

const PROVISION_KEY = 'f51d99d7e5514819890a1ef312d36c87';
const SCOPE = 'xact';
const RESPONSE_TYPE = 'code';
const CLIENT_ID = '4e53cd16a3e04fe2bd572eb94937517c';

class Consent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      parameters: props.parameters,
      isProcessing: props.isProcessing || false,
      isAuthorized: props.isAuthorized || false,
      code: props.code || ''
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    const params = {
      authenticated_userid: this.state.parameters.id,
      client_id: CLIENT_ID,
      response_type: RESPONSE_TYPE,
      scope: SCOPE,
      provision_key: PROVISION_KEY
    }
    this.props.authorize(params);
    e.preventDefault();
  }

  // componentWillMount() {
  //   if (!this.props.isAuthenticated) {
  //     this.redirectUser();
  //   }
  // }

  // redirectUser() {
  //   this.props.router.replace('/signin');
  // }

  componentWillReceiveProps(nextProps) {
    // code is actually embedded in a redirect URI
    this.state = {
      code: nextProps.code.substr(nextProps.code.length - nextProps.code.indexOf('='))
    }
  }

  render() {
    if (!this.props.isAuthorized) {
      return (
        <div width='100%'>
          <br />
          <span className='welcome'>Welcome {this.props.parameters.id}</span>
          <img
            id='profile-img'
            alt=''
            src='https://openclipart.org/download/184625/1381071925.svg'
            height='200'
            width='200'
            />
          <br />
          <br />
          <form className='form-signin' onSubmit={this.onSubmit}>
            <button
              className='btn btn-lg btn-primary btn-block btn-signin'
              type='submit'>Authorize
          </button>
          </form>
        </div>
      );
    }

    return (
      <div width='100%'>
        <table className='result'>
          <tr><td>User id</td><td>{this.props.parameters.id}</td></tr>
          <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Provision Key</td><td>{PROVISION_KEY}</td></tr>
          <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Authorization code</td><td className='code'>{this.state.code}</td></tr>
        </table>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    parameters: getParameters(state),
    isAuthorized: isAuthorized(state),
    code: getCode(state)
  };
};

export default connect(mapStateToProps, { authorize })(Consent);
