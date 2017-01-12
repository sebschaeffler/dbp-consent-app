import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../actions';
import { getParameters, isProcessing, isAuthenticated } from '../selectors';

class SignIn extends Component {

  constructor(props) {
    super(props);

    const {query: {challenge}} = this.props.location;

    this.state = {
      id: (props.parameters ? props.parameters.id : '') || '',
      challenge: challenge,
      password: (props.parameters ? props.parameters.password : '') || '',
      isProcessing: props.isProcessing || false,
      isAuthenticated: props.isAuthenticated || false
    };

    this.onIdParameterChange = this.onIdParameterChange.bind(this);
    this.onPasswordParameterChange = this.onPasswordParameterChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //console.log("SignIn new props: ", nextProps.parameters);
    if (nextProps.isAuthenticated) {
      // If the user is already authenticated
      this.redirectUser();
    }
  }

  onSubmit(e) {
    this.props.authenticate(this.buildParametersFromLocalState());
    e.preventDefault();
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

  render() {
    return (
      <div width='100%' >
        <img
          id='profile-img'
          alt=''
          src='//cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png'
          height='200'
          width='200'
          />
        <br />
        <br />
        <form className='form-signin' onSubmit={this.onSubmit}>
          <input onChange={this.onIdParameterChange}
            type='text'
            className='form-control'
            placeholder='Email address'
            required
            autoFocus value={this.state.id} />
          <br />
          <br />
          <input onChange={this.onPasswordParameterChange}
            type='password'
            className='form-control'
            placeholder='Password'
            required
            value={this.state.password} />
          <br />
          <br />
          <button className='btn btn-lg btn-primary btn-block btn-signin'
            type='submit'
            disabled={this.state.isProcessing}>Sign in
            </button>
        </form>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    parameters: getParameters(state),
    isProcessing: isProcessing(state),
    isAuthenticated: isAuthenticated(state)
  };
};

export default connect(mapStateToProps, { authenticate })(SignIn);
