import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { TokenLocalKey } from '../api';

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let token = localStorage.getItem(TokenLocalKey);

    if (token == null)
      return (<Redirect to="/login" />);
    else
      return (<h1>Main page</h1>);
  }
}