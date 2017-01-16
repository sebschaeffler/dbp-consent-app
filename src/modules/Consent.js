import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authorize } from '../actions';
import { getParameters, isAuthorized, getCode, getConsentError } from '../selectors';
import utils from '../utils/utils';

// Hydra
const PROVIDER = process.env.PROVIDER || 'hydra';
const DBP_DEMO = process.env.DBP_DEMO || false;

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
      code: props.code || '',
      error: props.consentError || null,
      cancelProcess: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.redirectToClientApp = this.redirectToClientApp.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderFinal = this.renderFinal.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    let params = {};
    if (PROVIDER === 'hydra') {
      params = {
        challenge: this.state.parameters.challenge,
        decodedChallenge: this.state.parameters.decodedChallenge,
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
  }

  onCancel(e) {
    e.preventDefault();
    this.setState({ cancelProcess: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signInError !== null && nextProps.signInError) {
      //console.log("Errorerror: ", nextProps.signInError);
      this.setState({ error: nextProps.signInError });
      return;
    }
    if (nextProps.code === null || !nextProps.code) {
      //console.log("Consent code is null or not defined");
      return;
    }
    const code = nextProps.code;
    if (PROVIDER !== 'hydra') {
      nextProps.code.substr(nextProps.code.length - nextProps.code.indexOf('='))
    }

    this.state = {
      code
    }
  }

  renderError() {
    if (this.state.error !== null) {
      return (
        <div className="error">
          {this.state.error}
        </div>
      );
    }
  }

  redirectToClientApp(code) {
    if (!this.props.parameters.decodedChallenge.redir) {
      //console.log("No redirection URI found in challenge");
      return;
    }
    let uri = utils.getParams(this.props.parameters.decodedChallenge.redir).redirect_uri;
    if (code !== null && code) {
      uri = `${uri}?consent=${code}`;
    }
    //console.log("Redirection to: ", uri);
    window.location = uri;
    return;
  }

  renderFinal() {
    if (DBP_DEMO) {
      return (
        <table className='consent result'>
          <tbody>
            <tr><td><span className="label">UserId</span></td><td><span className="label">{this.props.parameters.id}</span></td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td><span className="label">Token</span></td><td className='code'><span className='consent'>{this.state.code}</span></td></tr>
          </tbody>
        </table>
      );
    } else {
      this.redirectToClientApp(this.state.code);
      return (
        <div className='consent'>
          <div className="title">
            Please wait
          </div>
          <div className="label">
            You will be redirected shortly...
          </div>
        </div>
      );
    }
  }

  render() {
    //console.log(this.state);
    if (!this.props.isAuthorized && !this.state.cancelProcess) {
      return (
        <div width='100%'>
          <form className='consent'>
            <div>
              <div className="title">Welcome {this.props.parameters.id}</div>
              <div className="label resources">Do you authorize 'DBP-Demo-App' to access your resources?
                 <ul>
                  {this.state.parameters.decodedChallenge.scp.map(function (scope) {
                    return (<li id="scope">{scope}</li>);
                  })}
                </ul>
              </div>
              <div>
                <button
                  className='spinner ok'
                  onClick={this.onSubmit}>
                  Authorize
                </button>
                <button
                  className='cancel'
                  onClick={this.onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
          {this.renderError()}
        </div>
      );
    }

    return (
      <div width='100%'>
        <br />
        {this.renderFinal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    parameters: getParameters(state),
    isAuthorized: isAuthorized(state),
    code: getCode(state),
    consentError: getConsentError(state)
  };
};

export default connect(mapStateToProps, { authorize })(Consent);
