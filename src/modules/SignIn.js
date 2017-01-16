import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../actions';
import { getParameters, isProcessing, isAuthenticated, getSignInError } from '../selectors';

class SignIn extends Component {

  constructor(props) {
    super(props);

    const {query: {challenge}} = this.props.location;

    this.state = {
      id: (props.parameters ? props.parameters.id : '') || '',
      challenge: challenge,
      password: (props.parameters ? props.parameters.password : '') || '',
      isProcessing: props.isProcessing || false,
      isAuthenticated: props.isAuthenticated || false,
      error: props.signInError || null
    };

    this.onIdParameterChange = this.onIdParameterChange.bind(this);
    this.onPasswordParameterChange = this.onPasswordParameterChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      // If the user is already authenticated
      this.redirectUser();
    } else if (nextProps.signInError !== null && nextProps.signInError) {
      //console.log("Errorerror: ", nextProps.signInError);
      this.setState({ error: nextProps.signInError });
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
        {/*<img
          id='profile-img'
          alt=''
          src='//cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png'
          height='200'
          width='200'
          />
        <br />
        <br />*/}
        <form 
          className='login {this.state.isProcessing ? loading} {nextProps.isAuthenticated ? ok}' 
          onSubmit={this.onSubmit} 
          ref="loginForm">
          <p className="title">Log in</p>
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
            <i class="spinner"></i>
            <span class="state" ref="state">Log in</span>
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
