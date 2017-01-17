import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { authenticate } from '../actions';
import { getParameters, isProcessing, isAuthenticated, getSignInError } from '../selectors';

class SignIn extends Component {

  constructor(props) {
    super(props);

    const {query: {challenge}} = this.props.location;
    const {query: {error}} = this.props.location;

    this.state = {
      id: (props.parameters ? props.parameters.id : '') || '',
      challenge: challenge,
      password: (props.parameters ? props.parameters.password : '') || '',
      isProcessing: props.isProcessing || false,
      isAuthenticated: props.isAuthenticated || false,
      error: error || null
    };

    this.onIdParameterChange = this.onIdParameterChange.bind(this);
    this.onPasswordParameterChange = this.onPasswordParameterChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isProcessing) {
      //console.log("Processing...");
      this.setState({ isProcessing: true });
    } else if (nextProps.isAuthenticated) {
      //console.log("Authenticated!");
      this.setState({ isAuthenticated: true });
      // If the user is already authenticated
      setTimeout(function () {
        this.redirectUser();
      }.bind(this), 1500);
    } else if (nextProps.signInError !== null && nextProps.signInError) {
      //console.log("Errorerror: ", nextProps.signInError);
      this.setState({ 
        isProcessing: false,
        isAuthenticated: false,
        error: nextProps.signInError 
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.authenticate(this.buildParametersFromLocalState());
  }

  buildParametersFromLocalState() {
    return {
      id: this.state.id !== '' ? this.state.id : null,
      password: this.state.password !== '' ? this.state.password : null,
      challenge: this.state.challenge !== '' ? this.state.challenge : null
    };
  }

  onIdParameterChange(event) {
    this.setState({ id: event.target.value });
  }

  onPasswordParameterChange(event) {
    this.setState({ password: event.target.value });
  }

  redirectUser() {
    this.props.router.push('/consent');
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

  render() {
    return (
      <div width='100%'>
        <form
          className={this.state.isAuthenticated ? 'login loading ok' : this.state.isProcessing ? 'login loading' : 'login'}
          onSubmit={this.onSubmit}>
          <p className="title">Please sign in</p>
          <input onChange={this.onIdParameterChange}
            type='text'
            placeholder='Email address'
            required
            autoFocus value={this.state.id} />
          <input onChange={this.onPasswordParameterChange}
            type='password'
            placeholder='Password'
            required
            value={this.state.password} />
          <button
            type='submit'
            disabled={this.state.isProcessing}>
            <FontAwesome
              className='spinner'
              name='spinner' />
            <span className="state">{this.state.isAuthenticated ? 'Authenticated' : this.state.isProcessing ? 'Signing in...' : 'Sign in'}</span>
          </button>
        </form>
        {this.renderError()}
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    parameters: getParameters(state),
    isProcessing: isProcessing(state),
    isAuthenticated: isAuthenticated(state),
    signInError: getSignInError(state)
  };
};

export default connect(mapStateToProps, { authenticate })(SignIn);
