import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let token = localStorage.getItem(this.props.tknKey);

    if (token != null)
      return (<Redirect to="/lectures" />);
    else
      return (<h1>Login</h1>);
  }
}