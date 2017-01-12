import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authorize } from '../actions';
import { getParameters, isAuthorized, getCode } from '../selectors';

// Hydra
const PROVIDER = process.env.PROVIDER || 'hydra';

// Kong parameters
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
    let params = {};
    if (PROVIDER === 'hydra') {
      params = {
        challenge: this.state.parameters.challenge,
        // assume that all scopes have been granted
        scopes: this.state.parameters.challenge.scp,
        authenticated_userid: this.state.parameters.id
      }
    } else {
      params = {
        authenticated_userid: this.state.parameters.id,
        client_id: CLIENT_ID,
        response_type: RESPONSE_TYPE,
        scope: SCOPE,
        provision_key: PROVISION_KEY
      }
    }
    this.props.authorize(params);
    e.preventDefault();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.code === null || !nextProps.code) {
      console.log("Consent code is null or not defined");
    }
    const code = nextProps.code;
    if (PROVIDER !== 'hydra') {
      nextProps.code.substr(nextProps.code.length - nextProps.code.indexOf('='))
    }
    // code is actually embedded in a redirect URI
    this.state = {
      code
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
        <br />
        <table className='result'>
          <tbody>
            <tr><td>User id</td><td>{this.props.parameters.id}</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>Provision Key</td><td>{PROVISION_KEY}</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>Authorization code</td><td className='code'><span className='consent'>{this.state.code}</span></td></tr>
          </tbody>
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
